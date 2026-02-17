

import React, { useState } from 'react';
import type { Product, VaultCredential, OverseerLogEntry, PortfolioRules, ProductBlueprint, ButtondownSubscriber } from '../types';
import { ShoppingCart, Bot, Copy, Check, ChevronDown, BookOpen, Send, Loader as LoaderIcon, Webhook, FileText, Users, Film, Mic } from 'lucide-react';
import { generateNewsletterContent, getButtondownSubscribers } from '../services/geminiService';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

interface ProductLaunchpadProps {
    products: Product[];
    productBlueprints: ProductBlueprint[];
    onLaunch: (blueprintId: string) => void;
    onUpdateProduct: (product: Product) => void;
    credentials: VaultCredential[];
    addLogEntry: (agentTitle: string, message: string, type: OverseerLogEntry['type']) => void;
    portfolioRules: PortfolioRules;
    onSimulateGumroadSale: (productName: string, price: number) => void;
    onGenerateNextVideo: (seriesId: string) => Promise<void>;
    onGenerateVoiceover: (productId: string) => Promise<void>;
}

const ProductLaunchpad: React.FC<ProductLaunchpadProps> = ({ products, productBlueprints, onLaunch, onUpdateProduct, credentials, addLogEntry, portfolioRules, onSimulateGumroadSale, onGenerateNextVideo, onGenerateVoiceover }) => {
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
    const [generatingNewsletterFor, setGeneratingNewsletterFor] = useState<string | null>(null);
    const [sendingNewsletterFor, setSendingNewsletterFor] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'assets' | 'newsletter' | 'integrations'>('assets');
    const [isGeneratingNext, setIsGeneratingNext] = useState<string | null>(null);

    // State for Subscriber Intelligence
    const [subscribers, setSubscribers] = useState<ButtondownSubscriber[] | null>(null);
    const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);
    const [subscriberError, setSubscriberError] = useState<string | null>(null);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleGenerateNewsletter = async (product: Product) => {
        setGeneratingNewsletterFor(product.id);
        try {
            const result = await generateNewsletterContent(product);
            const updatedProduct = { ...product, generatedNewsletter: result };
            onUpdateProduct(updatedProduct);
            addLogEntry('Newsletter Studio', `Generated newsletter for "${product.name}".`, 'success');
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : 'Unknown error';
            addLogEntry('Newsletter Studio', `Failed to generate newsletter: ${errorMsg}`, 'error');
        } finally {
            setGeneratingNewsletterFor(null);
        }
    };

    const handleGenerateNext = async (seriesId: string) => {
        setIsGeneratingNext(seriesId);
        try {
            await onGenerateNextVideo(seriesId);
        } catch (e) {
             // Error is logged in App.tsx
        } finally {
            setIsGeneratingNext(null);
        }
    };

    const handleSendNewsletter = async (product: Product) => {
        if (!product.generatedNewsletter) return;

        const activeProvider = portfolioRules.activeEmailProvider;
        setSendingNewsletterFor(product.id);

        try {
            let response: Response;
            if (activeProvider === 'ConvertKit') {
                const convertkitSecret = credentials.find(c => c.service === 'CONVERTKIT_API_SECRET')?.apiKey;
                if (!convertkitSecret) throw new Error('ConvertKit API Secret not found in vault.');

                response = await fetch('https://api.convertkit.com/v3/broadcasts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        api_secret: convertkitSecret,
                        subject: product.generatedNewsletter.subject,
                        content: product.generatedNewsletter.body,
                    }),
                });
            } else { // Default to Buttondown
                const buttondownKey = credentials.find(c => c.service === 'BUTTONDOWN_API_KEY')?.apiKey;
                if (!buttondownKey) throw new Error('Buttondown API key not found in vault.');

                response = await fetch('https://api.buttondown.email/v1/sends', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${buttondownKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subject: product.generatedNewsletter.subject,
                        body: product.generatedNewsletter.body,
                    }),
                });
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`${activeProvider} API error: ${response.status} ${errorData}`);
            }

            addLogEntry('Newsletter Studio', `Successfully sent newsletter via ${activeProvider}.`, 'success');
        } catch (e) {
             const errorMsg = e instanceof Error ? e.message : 'Unknown error';
            addLogEntry('Newsletter Studio', `Failed to send newsletter: ${errorMsg}`, 'error');
        } finally {
            setSendingNewsletterFor(null);
        }
    };

    const handleFetchSubscribers = async () => {
        const buttondownKey = credentials.find(c => c.service === 'BUTTONDOWN_API_KEY')?.apiKey;
        if (!buttondownKey) {
            setSubscriberError('Buttondown API key not found in vault. Please add it in the Strategy dashboard.');
            return;
        }

        setIsFetchingSubscribers(true);
        setSubscriberError(null);
        setSubscribers(null);

        try {
            const subs = await getButtondownSubscribers(buttondownKey);
            setSubscribers(subs);
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : 'Unknown error';
            setSubscriberError(errorMsg);
        } finally {
            setIsFetchingSubscribers(false);
        }
    };
    
    const renderProductCard = (product: Product) => (
         <div key={product.id} className="bg-gray-900/50 rounded-lg border border-gray-600">
            <button
                onClick={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <div>
                    <h4 className="text-lg font-bold text-white">{product.topic}</h4>
                    <p className="text-sm text-gray-400">YouTube Video Assets</p>
                </div>
                <ChevronDown size={24} className={`transition-transform duration-300 ${expandedProductId === product.id ? 'rotate-180' : ''}`} />
            </button>
            {expandedProductId === product.id && (
                <div className="border-t border-gray-700">
                    <div className="flex border-b border-gray-700">
                        <button onClick={() => setActiveTab('assets')} className={`flex-1 py-2 text-sm font-medium ${activeTab === 'assets' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:bg-gray-700/50'}`}>Assets</button>
                        <button onClick={() => setActiveTab('newsletter')} className={`flex-1 py-2 text-sm font-medium ${activeTab === 'newsletter' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:bg-gray-700/50'}`}>Newsletter Studio</button>
                        <button onClick={() => setActiveTab('integrations')} className={`flex-1 py-2 text-sm font-medium ${activeTab === 'integrations' ? 'bg-indigo-600/20 text-indigo-300' : 'text-gray-400 hover:bg-gray-700/50'}`}>Integrations</button>
                    </div>

                    {activeTab === 'assets' && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-800/50 p-4 rounded-md">
                                        <h5 className="font-semibold text-white mb-2">Video Script</h5>
                                        <pre className="text-xs bg-gray-900 p-2 rounded h-48 overflow-auto font-mono whitespace-pre-wrap">{product.fullScript}</pre>
                                        {product.voiceoverAudio_base64 ? (
                                            <div className="mt-2 text-xs text-green-400 flex items-center">
                                                <Check size={14} className="mr-1" /> Voiceover generated.
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => onGenerateVoiceover(product.id)}
                                                className="btn-secondary text-xs mt-2 inline-flex items-center"
                                            >
                                                <Mic size={14} className="mr-1" />
                                                Generate Voiceover
                                            </button>
                                        )}
                                    </div>
                                    <div className="bg-gray-800/50 p-4 rounded-md">
                                        <h5 className="font-semibold text-white mb-2">Thumbnail Prompt</h5>
                                        <p className="text-xs bg-gray-900 p-2 rounded font-mono">{product.thumbnailPrompt}</p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-white mb-3">Launch Checklist</h5>
                                    <div className="space-y-2">
                                        {product.launchChecklist.map((item, index) => (
                                            <div key={index} className="flex items-center text-sm p-2 bg-gray-800/50 rounded-md">
                                                <div className="w-4 h-4 border-2 border-gray-500 rounded-sm mr-3"></div>
                                                <p className="text-gray-300">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {product.seriesId && (
                                <div className="border-t border-border-primary pt-4 text-center">
                                    <h5 className="text-lg font-bold text-white mb-2">AI Showrunner Protocol</h5>
                                     <p className="text-sm text-text-secondary mb-3">Command the AI Showrunner to generate the next video in this series.</p>
                                    <button
                                        onClick={() => handleGenerateNext(product.seriesId!)}
                                        disabled={isGeneratingNext === product.seriesId}
                                        className="btn-primary"
                                    >
                                        {isGeneratingNext === product.seriesId ? <Loader small/> : <><Film size={16} className="mr-2" />Generate Next Video</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'newsletter' && (
                        <div className="p-6">
                            <h5 className="text-lg font-bold text-white mb-4">Newsletter Studio</h5>
                            {product.generatedNewsletter ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Subject</label>
                                        <input type="text" readOnly value={product.generatedNewsletter.subject} className="w-full bg-gray-800 border-gray-700 rounded-md mt-1"/>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Body</label>
                                        <textarea readOnly value={product.generatedNewsletter.body} className="w-full bg-gray-800 border-gray-700 rounded-md mt-1 h-32"/>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleSendNewsletter(product)} disabled={sendingNewsletterFor === product.id} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:bg-gray-600">
                                            {sendingNewsletterFor === product.id ? <Loader small /> : <><Send size={16} className="mr-2"/>Send via {portfolioRules.activeEmailProvider}</>}
                                        </button>
                                        <button onClick={() => handleGenerateNewsletter(product)} disabled={generatingNewsletterFor === product.id} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg disabled:bg-gray-800">
                                            Regenerate
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center bg-gray-800/50 p-6 rounded-md border border-dashed border-gray-600">
                                    <p className="text-gray-400 mb-4">No newsletter generated for this product yet.</p>
                                    <button onClick={() => handleGenerateNewsletter(product)} disabled={generatingNewsletterFor === product.id} className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:bg-gray-600">
                                        {generatingNewsletterFor === product.id ? <Loader small /> : <><Bot className="h-5 w-5 mr-2"/>Generate with AI</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="p-6 space-y-6">
                            <h5 className="text-lg font-bold text-white">Automated Integrations</h5>
                            <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
                                <h6 className="font-semibold text-white mb-2">Gumroad Sales Webhook</h6>
                                <p className="text-sm text-gray-400 mb-3">Automatically add new Gumroad customers to your email list. Add your Gumroad Webhook Secret to the vault, then use the URL below in your Gumroad product's "Advanced" settings.</p>
                                <div>
                                    <label className="text-xs font-medium text-gray-400">Your Webhook URL</label>
                                    <input type="text" readOnly value="https://elite-hive.ai/api/webhooks/gumroad" className="w-full bg-gray-900 border-gray-600 rounded-md mt-1 font-mono text-sm"/>
                                </div>
                                <div className="mt-4 border-t border-gray-700 pt-4">
                                    <h6 className="text-sm font-semibold text-white mb-2">Test Your Integration</h6>
                                    <p className="text-xs text-gray-400 mb-3">Click to simulate a successful purchase. This will add a new subscriber to {portfolioRules.activeEmailProvider} and record a $99 transaction.</p>
                                    <button
                                        onClick={() => onSimulateGumroadSale(product.name, 99)}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                                    >
                                        <Webhook size={16} className="mr-2" />
                                        Simulate Purchase Webhook
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
                                <h6 className="font-semibold text-white mb-2">Subscriber Intelligence</h6>
                                <p className="text-sm text-gray-400 mb-3">Fetch and view your live subscriber list from your active email provider ({portfolioRules.activeEmailProvider}).</p>
                                <button
                                    onClick={handleFetchSubscribers}
                                    disabled={isFetchingSubscribers}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:bg-gray-600"
                                >
                                    {isFetchingSubscribers ? <Loader small /> : <><Users size={16} className="mr-2" />Fetch Subscriber List</>}
                                </button>
                                
                                <div className="mt-4">
                                    {subscriberError && <ErrorMessage message={subscriberError} />}
                                    {subscribers && (
                                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                            {subscribers.length > 0 ? subscribers.map(sub => (
                                                <div key={sub.id} className="bg-gray-900/50 p-2 rounded-md flex justify-between items-center text-sm">
                                                    <span className="text-gray-300 font-mono">{sub.email}</span>
                                                    <span className="text-gray-500">{new Date(sub.creation_date).toLocaleDateString()}</span>
                                                </div>
                                            )) : <p className="text-gray-500 text-center py-4">You have no subscribers yet.</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );


    return (
        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <ShoppingCart size={22} className="mr-3 text-indigo-400" />
                Product Launchpad
            </h3>
            <p className="text-sm text-gray-400 mb-6">
                Deploy autonomous AI crews to generate all the assets for your digital products and manage post-launch marketing.
            </p>

            <div className="space-y-6">
                {productBlueprints.length > 0 && (
                     <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                         <h4 className="text-lg font-bold text-white mb-3">Available Blueprints</h4>
                         <div className="space-y-3">
                            {productBlueprints.map(bp => (
                                <div key={bp.id} className="bg-gray-800/50 p-3 rounded-md border border-gray-600 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-indigo-300">{bp.name}</p>
                                        <p className="text-xs text-gray-400">{bp.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => onLaunch(bp.id)}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm"
                                    >
                                        <Bot className="h-4 w-4 mr-2" />
                                        Generate Assets & Launch
                                    </button>
                                </div>
                            ))}
                         </div>
                     </div>
                )}
                
                <div>
                     <h4 className="text-lg font-bold text-white mb-3">Launched Products</h4>
                     {products.length > 0 ? (
                        <div className="space-y-4">
                            {products.map(renderProductCard)}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-900/50 rounded-lg border border-gray-700">
                            <p className="text-gray-500">No products have been launched yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductLaunchpad;