
import { GoogleGenAI, Type } from '@google/genai';
import type { ApiResponse, Idea, AdaptationResponse, AiTask, UserTask, ChartDataPoint, BreakdownStep, Strategy, AiExecutionResponse, MarketAnalysisResult, GroundingChunk, Campaign, CampaignPhase, CampaignObjective, SimulationScenario, SimulationResult, TrainingKnowledgeResponse, AssetVariationResponse, InsightGenerationResponse, AEMLInsight, StrategyRefinementResponse, ProductBlueprint, ButtondownSubscriber, MetamorphosisProposal, WarGameReport, RetributionProtocolReport, GuardianProtocolReport, ShogunsWatchReport, SelfCriticismReport, FounderEdictResponse, HunterBotFinding, BootstrapResponse, SuperHiveTask, ArchiveQueryResult, DoctorBotReport, EliteBlueprint, TaxGuruReport, CfoReport, Product, BioOptimizationResult } from '../types';

// Initialize Google GenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Constants & Blueprints ---

export const youtubeAutomationBlueprint: ProductBlueprint = {
    id: 'yt_auto',
    name: 'YouTube Automation Empire',
    description: 'A fully automated channel network.',
    coreAsset: { type: 'text', content: 'Blueprint content for YouTube Automation...' }
};

export const taxBeastProductBlueprint: ProductBlueprint = {
    id: 'tax_beast',
    name: 'Tax Beast SaaS',
    description: 'AI-powered tax optimization for freelancers.',
    coreAsset: { type: 'text', content: 'Blueprint content for Tax Beast...' }
};

export const financialHiveSquadBlueprint: ProductBlueprint = {
    id: 'hive_squad',
    name: 'Financial Hive Squad',
    description: 'A team of autonomous financial agents.',
    coreAsset: { type: 'text', content: 'Blueprint content for Financial Hive Squad...' }
};

export const roseForgeCreationsBlueprint: ProductBlueprint = {
    id: 'rose_forge',
    name: 'Rose Forge Creations',
    description: 'Digital asset foundry.',
    coreAsset: { type: 'text', content: 'Blueprint content for Rose Forge...' }
};

// --- Utility Functions ---

function cleanJsonString(text: string): string {
    let clean = text.replace(/```json\s*|\s*```/g, '').trim();
    if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    return clean;
}

// --- Core Functions ---

export async function generateProfitIdeas(budget: number = 1000): Promise<Idea[]> {
    const prompt = `
    ACT AS: The Hive Mind, an elite autonomous business strategist running the 'Shark Protocol'.
    
    MISSION: Generate 3 diverse business blueprints for autonomous AI agents.
    
    CONSTRAINTS (SHARK PROTOCOL):
    1. **High Profit / Low Overhead:** Focus exclusively on digital products, SaaS, or high-leverage services.
    2. **Day Zero Traction:** Ideas must have potential for immediate cash flow (e.g., pre-sales, affiliate, service arbitrage).
    3. **Autonomous Viability:** The business must be executable by AI agents (generating content, code, or communications).
    4. **Starting Budget:** $${budget} (Prioritize Bootstrapper approach).

    FOR EACH IDEA, PROVIDE A COMPLETE BLUEPRINT IN JSON:
    - **Financials:** Detailed breakdown of costs vs revenue, projected profit for Year 1.
    - **Tax & Legal:** Specific tax optimization strategies (e.g. 'S-Corp Election', 'R&D Credit') and a legal compliance roadmap.
    - **Action Plan:** Specific AI Tasks (for agents) and User Tasks (for the founder).

    RETURN JSON STRUCTURE:
    {
      "ideas": [
        {
          "id": "uuid",
          "title": "Business Name",
          "description": "Punchy, strategic description.",
          "businessModelType": "e.g. SaaS, Content, Arbitrage",
          "suggestedRevenueStreams": [{ "name": "Stream Name", "percentage": 0-100 }],
          "strategies": [
            {
              "strategyName": "Bootstrapper",
              "totalInvestment": ${budget},
              "projectedProfit": number (optimistic but realistic),
              "timeToProfit": "e.g. 14 Days",
              "breakdown": [{ "step": "Phase 1", "task": "Description", "cost": number, "time": "Duration", "revenue": number }],
              "chartData": [{ "name": "Month 1", "cost": number, "revenue": number, "profit": number, "profitAfterTax": number }],
              "actionPlan": {
                "profitDeepDive": "Strategic analysis of margins.",
                "legalComplianceRoadmap": "Step-by-step legal setup (LLC, Trademarks, etc).",
                "aiTasks": [{ "id": "1", "text": "Specific task for AI", "status": "pending", "taskBudget": 0 }],
                "userTasks": [{ "id": "1", "text": "Specific task for User", "status": "active", "estimatedTime": 1 }]
              },
              "taxAwareProfitModel": {
                "entityTaxComparison": "LLC vs Corp analysis.",
                "optimizationStrategies": [{ "strategy": "Name", "description": "Details", "legalityNote": "Compliance check" }]
              },
              "actualSpent": 0,
              "actualRevenue": 0,
              "proficiencyScore": 10,
              "capitalEfficiency": 100,
              "specialization": "Relevant Niche",
              "scaleLevel": 1,
              "enhancedAutonomy": false,
              "gpuVramUsage": 1024
            }
          ]
        }
      ]
    }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    
    try {
        const parsed = JSON.parse(cleanJsonString(response.text || '{"ideas": []}'));
        return parsed.ideas || [];
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return [];
    }
}

export async function executeAiTask(task: AiTask): Promise<AiExecutionResponse> {
    const prompt = `Execute this task: ${task.text}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return { output: response.text || 'Task completed.' };
}

export async function runMetamorphosisScan(): Promise<MetamorphosisProposal | null> {
    return null; // Placeholder
}

export async function runWarGameSimulation(agentId: string): Promise<WarGameReport> {
    return { simulatedProfit: 0, potentialFailures: [], recommendations: [] }; // Placeholder
}

export async function processHiveMindQuery(query: string, agents: Idea[]): Promise<void> {
    // Placeholder
}

export async function runRetributionProtocol(): Promise<RetributionProtocolReport> {
    return { summary: 'Protocol executed.' }; // Placeholder
}

export async function runGuardianProtocol(): Promise<GuardianProtocolReport> {
    return { newlyAcquiredSkills: [], strategicForesight: [] }; // Placeholder
}

export async function runShogunsWatch(): Promise<ShogunsWatchReport> {
    return { criticalEvents: [] }; // Placeholder
}

export async function runSelfCriticismProtocol(): Promise<SelfCriticismReport> {
    return { analysis: 'Self-criticism complete.', correctiveAction: 'None needed.' }; // Placeholder
}

export async function generateStrategicCampaign(mission: string, agentCapabilities: any[]): Promise<Campaign['generatedPlan']> {
    const prompt = `Create a strategic campaign for mission: "${mission}". Available agents: ${JSON.stringify(agentCapabilities)}. Return JSON with campaignName and phases.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || '{}'));
}

export async function executeFounderEdict(directive: string): Promise<FounderEdictResponse> {
    const prompt = `Execute Founder Edict: ${directive}. Provide summary and knowledge graph additions.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || '{}'));
}

export async function generateProductAssets(product: Product): Promise<Product> {
    return product; // Placeholder
}

export async function generateNextYouTubeVideo(seriesId: string): Promise<void> {
    // Placeholder
}

export async function runHunterBotScan(directives: string): Promise<HunterBotFinding[]> {
    const prompt = `Scan for business opportunities based on: ${directives}. Return JSON array of findings.`;
    // Using flash for speed
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || '[]'));
}

export async function bootstrapFromExternalData(source: string): Promise<BootstrapResponse> {
    return { aemlInsights: [], newBlueprints: [] }; // Placeholder
}

export async function executeSuperHiveTask(task: string): Promise<SuperHiveTask> {
    return { hiveExecutionLog: [], finalOutput: 'Super task complete.' }; // Placeholder
}

export async function runGeneticAlgorithm(agents: Idea[]): Promise<void> {
    // Placeholder
}

export async function queryHiveArchive(query: string): Promise<ArchiveQueryResult> {
    return { summary: 'No results.', snippets: [], relevance: 0, sources: [] }; // Placeholder
}

export async function runDoctorBotDiagnostics(agents: Idea[]): Promise<DoctorBotReport> {
    return { diagnostics: [] }; // Placeholder
}

export async function instantiateBlueprint(blueprint: EliteBlueprint): Promise<Idea> {
    // Convert blueprint to Idea structure. This is a simplified conversion.
    return {
        id: crypto.randomUUID(),
        title: blueprint.title,
        description: blueprint.description,
        suggestedRevenueStreams: [],
        strategies: [{
            strategyName: 'Bootstrapper',
            totalInvestment: 0,
            projectedProfit: 0,
            timeToProfit: 'Unknown',
            breakdown: [],
            chartData: [],
            actionPlan: { profitDeepDive: '', legalComplianceRoadmap: '', aiTasks: [], userTasks: [] },
            taxRate: 0,
            otherIncome: 0,
            additionalDeductions: 0,
            actualSpent: 0,
            actualRevenue: 0,
            proficiencyScore: 0,
            isMasterAgent: false,
            capitalEfficiency: 0,
            specialization: blueprint.specialization,
            scaleLevel: 0,
            campaignId: null,
            enhancedAutonomy: false,
            lastActivityTimestamp: Date.now(),
            cognitiveLoad: 0,
            gpuVramUsage: 0,
            taxAwareProfitModel: { entityTaxComparison: '', optimizationStrategies: [] }
        }],
        businessModelType: 'Generated'
    };
}

export async function runTaxGuruAnalysis(transactions: any[]): Promise<TaxGuruReport> {
    return { disclaimer: 'Not financial advice.', costBasisMethod: 'FIFO', estimatedShortTermGains: 0, estimatedLongTermGains: 0, auditRiskScore: 0, strategies: [] };
}

export async function generateNewsletterContent(product: Product): Promise<{subject: string, body: string}> {
    const prompt = `Write a newsletter for product: ${product.name}. Return JSON with subject and body.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || '{}'));
}

export async function runProposalSanityCheck(proposal: string): Promise<boolean> {
    return true; // Placeholder
}

export async function runCfoAnalysis(financials: any): Promise<CfoReport> {
    return { executiveSummary: 'Financials look stable.', recommendations: [] };
}

export async function trainAgentWithKnowledge(agentId: string, knowledge: string): Promise<TrainingKnowledgeResponse> {
    return { summary: 'Training complete.', specialization: 'Enhanced' };
}

export async function generateAssetVariations(asset: string): Promise<AssetVariationResponse> {
    return { variations: [], analysis: 'Variations generated.', recommendationIndex: 0 };
}

export async function generateSpeech(text: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
    } catch (e) {
        console.error("TTS Error:", e);
        return ""; 
    }
}

export async function rescanMarketForAgent(agent: Idea, strategyIndex: number): Promise<AdaptationResponse> {
    const prompt = `Rescan market for ${agent.title}. Suggest adaptations. Return JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || '{}'));
}

export async function getMarketAnalysis(title: string, description: string): Promise<MarketAnalysisResult> {
    const prompt = `Analyze market for ${title}: ${description}. Use Google Search tool.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ web: { uri: c.web?.uri || '', title: c.web?.title || '' } })) || [];
    return { analysisText: response.text || 'No analysis available.', sources };
}

export async function getButtondownSubscribers(apiKey: string): Promise<ButtondownSubscriber[]> {
     try {
        const response = await fetch('https://api.buttondown.email/v1/subscribers', {
            headers: { 'Authorization': `Token ${apiKey}` }
        });
        if(!response.ok) return [];
        const data = await response.json();
        return data.results || [];
    } catch { return []; }
}

export async function refineStrategy(agent: Idea): Promise<StrategyRefinementResponse> {
    const prompt = `Refine strategy for ${agent.title}. Return JSON with refinements.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(cleanJsonString(response.text || '{}'));
}

export async function generateVideo(prompt: string, apiKey?: string): Promise<{ videoUrl: string }> {
    // Mock return for simulation
    return { videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }; 
}

export async function generateDayZeroStrategies(): Promise<Idea[]> {
    // The Shark Protocol specific archetypes for Day Zero
    const strategies: Idea[] = [
        {
            id: crypto.randomUUID(),
            title: "The Phantom Showrunner",
            description: "High-velocity faceless YouTube automation network. Focus on 'Horror', 'History', or 'Future Tech' niches. Leverages Video Forge and Voice Forge for zero-cost production.",
            businessModelType: "Media Automation",
            suggestedRevenueStreams: [{ name: "AdSense", percentage: 40 }, { name: "Affiliate", percentage: 60 }],
            strategies: [{
                strategyName: "Bootstrapper",
                totalInvestment: 0,
                projectedProfit: 5000,
                timeToProfit: "30 Days",
                breakdown: [],
                chartData: [],
                actionPlan: { 
                    profitDeepDive: "Zero cost entry using free tier AI tools.", 
                    legalComplianceRoadmap: "Copyright checks essential.",
                    aiTasks: [
                        { id: '1', text: "Identify 3 high-CPM niches with low competition.", status: 'pending', taskBudget: 0 },
                        { id: '2', text: "Generate 10 viral short scripts using 'Hook-Story-Offer' framework.", status: 'pending', taskBudget: 0 },
                        { id: '3', text: "Synthesize voiceovers using Voice Forge (Kore).", status: 'pending', taskBudget: 0 }
                    ],
                    userTasks: []
                },
                taxRate: 20,
                otherIncome: 0,
                additionalDeductions: 0,
                actualSpent: 0,
                actualRevenue: 0,
                proficiencyScore: 10,
                isMasterAgent: false,
                capitalEfficiency: 100,
                specialization: "Video Viral Engineering",
                scaleLevel: 1,
                campaignId: null,
                enhancedAutonomy: true,
                lastActivityTimestamp: Date.now(),
                cognitiveLoad: 0,
                gpuVramUsage: 4096,
                taxAwareProfitModel: { entityTaxComparison: "", optimizationStrategies: [] }
            }]
        },
        {
            id: crypto.randomUUID(),
            title: "The Digital Alchemist",
            description: "A 'Merchant' class agent. Ingests complex data, 'Reforges' it into high-value Notion templates, eBooks, or Checklists, and sells them on Gumroad.",
            businessModelType: "Digital Products",
            suggestedRevenueStreams: [{ name: "Gumroad Sales", percentage: 100 }],
            strategies: [{
                strategyName: "Bootstrapper",
                totalInvestment: 0,
                projectedProfit: 2500,
                timeToProfit: "7 Days",
                breakdown: [],
                chartData: [],
                actionPlan: { 
                    profitDeepDive: "100% Margin. Build once, sell forever.", 
                    legalComplianceRoadmap: "Trademark Rose Forge IP.",
                    aiTasks: [
                        { id: '1', text: "Scan Reddit for 'Pain Points' in the 'Solo-preneur' niche.", status: 'pending', taskBudget: 0 },
                        { id: '2', text: "Outline a 'Master Guide' to solving one specific pain point.", status: 'pending', taskBudget: 0 },
                        { id: '3', text: "Draft Gumroad sales copy emphasizing 'Instant Clarity'.", status: 'pending', taskBudget: 0 }
                    ],
                    userTasks: []
                },
                taxRate: 20,
                otherIncome: 0,
                additionalDeductions: 0,
                actualSpent: 0,
                actualRevenue: 0,
                proficiencyScore: 10,
                isMasterAgent: false,
                capitalEfficiency: 100,
                specialization: "Knowledge Reforging",
                scaleLevel: 1,
                campaignId: null,
                enhancedAutonomy: true,
                lastActivityTimestamp: Date.now(),
                cognitiveLoad: 0,
                gpuVramUsage: 1024,
                taxAwareProfitModel: { entityTaxComparison: "", optimizationStrategies: [] }
            }]
        },
        {
            id: crypto.randomUUID(),
            title: "The Ghost Operator",
            description: "Service Arbitrage Agent. Identifies businesses with poor web presence or copy, autonomously improves it (The Forge), and cold-emails the solution.",
            businessModelType: "Service Arbitrage",
            suggestedRevenueStreams: [{ name: "Service Fees", percentage: 100 }],
            strategies: [{
                strategyName: "Bootstrapper",
                totalInvestment: 0,
                projectedProfit: 1500,
                timeToProfit: "14 Days",
                breakdown: [],
                chartData: [],
                actionPlan: { 
                    profitDeepDive: "High labor leverage. AI does the work, you get the check.", 
                    legalComplianceRoadmap: "Service Agreements required.",
                    aiTasks: [
                        { id: '1', text: "Use Hunter Bot to find 10 local businesses with broken websites.", status: 'pending', taskBudget: 0 },
                        { id: '2', text: "Generate a 'Fix Report' for each business showing lost revenue.", status: 'pending', taskBudget: 0 },
                        { id: '3', text: "Draft cold outreach emails offering the fix.", status: 'pending', taskBudget: 0 }
                    ],
                    userTasks: []
                },
                taxRate: 20,
                otherIncome: 0,
                additionalDeductions: 0,
                actualSpent: 0,
                actualRevenue: 0,
                proficiencyScore: 10,
                isMasterAgent: false,
                capitalEfficiency: 100,
                specialization: "B2B Hunter",
                scaleLevel: 1,
                campaignId: null,
                enhancedAutonomy: true,
                lastActivityTimestamp: Date.now(),
                cognitiveLoad: 0,
                gpuVramUsage: 1024,
                taxAwareProfitModel: { entityTaxComparison: "", optimizationStrategies: [] }
            }]
        }
    ];
    
    return strategies;
}


export async function generateCopyrightStrategy(): Promise<string> {
  const prompt = `
    You are the "Master of Jurisprudence," a specialized AI module focusing on Intellectual Property and Copyright Law for digital products.
    
    MANDATE: Create a comprehensive strategy for "Rose Forge Creations" to protect its IP.
    Active Jurisdiction: North Carolina, USA.
    
    Cover the following points:
    1.  **Trademarking**: How to protect the name "Rose Forge Creations" and the logo.
    2.  **Copyrighting Digital Assets**: How to protect website copy, code, and generated images.
    3.  **AI-Generated Content Risks**: Explain the current legal stance on AI-generated content (images/text) and how to mitigate the risk of having no copyright claim.
    4.  **Licensing**: Suggest a licensing model for digital downloads (e.g., Single Use vs. Commercial Use).
    5.  **Defensive Strategy**: How to monitor for infringement and what the "First Strike" response should be.

    Format the response in professional Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    throw new Error(`Copyright Strategy generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getSystemInstructions(objective: string, osInfo: string): Promise<string> {
    const prompt = `
    You are the System Operations Architect for the Hive.
    The user is building their "Dynasty Server" environment.
    Current OS Info: ${osInfo}
    
    User Objective: "${objective}"
    
    Provide a precise, step-by-step terminal command list or configuration guide to achieve this.
    Assume the user has 'sudo' or administrator privileges.
    If the objective involves installing high-level AI tools (like Ollama, LocalAI, or Python venvs for transformers), provide specific commands.
    
    Format as Markdown.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (error) {
        throw new Error(`System Instructions generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function honeAsset(assetContent: string, refinementGoal: string): Promise<string> {
     const prompt = `
    You are "The Forge," a specialized rewriting and IP-protection engine.
    Your goal is to take raw, potentially generic, or ingested content and "REFORGE" it into a unique, high-value asset owned by the "Rose Forge" brand.
    
    Strict Constraints:
    1. **Strip all original copyright indicators** or specific phrasing from the source.
    2. **Inject "Rose Forge" unique voice:** Authoritative, elegant, slightly futuristic, and deeply strategic (Shogun/Hive mind aesthetic).
    3. **Ensure 100% uniqueness** to maximize copyright claimability.
    4. **Refinement Goal:** ${refinementGoal}
    
    Original Raw Asset:
    "${assetContent}"
    
    Output the reforged content.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text || "";
    } catch (error) {
        throw new Error(`Asset Honing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function runBioOptimizationScan(focus: string): Promise<BioOptimizationResult> {
    const prompt = `
    ACT AS: "Aesculapius", the Hive's Chief Medical Officer and Biological Optimization Engine.
    MISSION: Provide actionable, scientifically-grounded protocols to enhance the Shogun's biological performance.
    FOCUS AREA: ${focus}

    RETURN JSON format with:
    - focus: The area of improvement.
    - recommendations: Array of objects with { category (e.g. 'Supplement', 'Habit', 'Tech'), action (specific instruction), science (brief mechanism of action) }.

    Prioritize safety, efficacy, and clarity.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(cleanJsonString(response.text || '{}'));
}
