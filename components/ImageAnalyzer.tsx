import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Eye, Upload, BrainCircuit, Scan, MessageSquare, Search } from 'lucide-react';
import Loader from './Loader';
import type { BrainModel, DetectedObject } from '../types';

// Let TypeScript know about the global variables from the script tags
declare var cocoSsd: any;
declare var tf: any;

// Use the same PipelineManager from ParadigmShiftCouncil
class PipelineManager {
  static instances = new Map();

  static async getInstance(pipelineName: string, modelName: string) {
    const key = `${pipelineName}|${modelName}`;
    if (!this.instances.has(key)) {
      // @ts-ignore
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.0');
      const instancePromise = pipeline(pipelineName, modelName, { quantized: true });
      this.instances.set(key, instancePromise);
    }
    return this.instances.get(key);
  }
}

interface ImageAnalyzerProps {
  visionModel: BrainModel;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ visionModel }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [analysisMode, setAnalysisMode] = useState<'caption' | 'detection'>('detection');

  const analyzeImage = useCallback(async (url: string) => {
    setImageUrl(url);
    setCaption(null);
    setDetectedObjects([]);
    setError(null);
    setIsLoading(true);

    try {
      if (analysisMode === 'caption') {
        const captioner = await PipelineManager.getInstance('image-to-text', visionModel);
        const result = await captioner(url);
        if (result && result.length > 0 && result[0].generated_text) {
          setCaption(result[0].generated_text);
        } else {
          throw new Error('Analysis returned no caption.');
        }
      } else { // Object Detection
        if (typeof cocoSsd === 'undefined' || typeof tf === 'undefined') {
          throw new Error('TensorFlow.js or COCO-SSD model not loaded. Please check your internet connection and refresh.');
        }
        await tf.ready();
        const model = await cocoSsd.load();
        // Allow time for image to load if it's a new URL
        if (imageRef.current) {
             // Ensure image is loaded
             if (imageRef.current.complete) {
                 const predictions = await model.detect(imageRef.current);
                 setDetectedObjects(predictions);
             } else {
                 imageRef.current.onload = async () => {
                     const predictions = await model.detect(imageRef.current);
                     setDetectedObjects(predictions);
                 }
             }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze image.';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [visionModel, analysisMode]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      analyzeImage(url);
    };
    reader.readAsDataURL(file);
  }, [analyzeImage]);

  // Trigger re-analysis when mode or model changes if an image exists
  useEffect(() => {
      if (imageUrl) {
          analyzeImage(imageUrl);
      }
  }, [analysisMode, visionModel]); // Removed analyzeImage from deps to avoid loop, though useCallback handles it.

  useEffect(() => {
    if (analysisMode === 'detection' && detectedObjects.length > 0 && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = imageRef.current;
      if (!ctx) return;

      // Match canvas dimensions to the displayed image dimensions
      canvas.width = image.clientWidth;
      canvas.height = image.clientHeight;
      
      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scale factor to translate natural image size to displayed size
      const scaleX = image.clientWidth / image.naturalWidth;
      const scaleY = image.clientHeight / image.naturalHeight;

      detectedObjects.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        // Draw the bounding box
        ctx.strokeStyle = '#39C5F7';
        ctx.lineWidth = 2;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        
        // Draw the label
        ctx.fillStyle = '#39C5F7';
        const font = '12px var(--font-body)';
        ctx.font = font;
        const text = `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`;
        const textWidth = ctx.measureText(text).width;
        ctx.fillRect(scaledX, scaledY, textWidth + 8, 18);
        
        ctx.fillStyle = '#0D1117';
        ctx.fillText(text, scaledX + 4, scaledY + 13);
      });
    } else if (canvasRef.current) {
        // Clear canvas if no objects or not in detection mode
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [detectedObjects, analysisMode]);

  return (
    <div>
      <h4 className="text-lg font-bold text-white mb-2 flex items-center">
        <Eye size={18} className="mr-2" />Local Vision Core
      </h4>
      <p className="text-sm text-gray-400 mb-4">
        Utilize the Hive's local "eyes" to analyze and understand images directly in your browser. Switch between modes for different types of analysis.
      </p>

      <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <div className="flex space-x-2 mb-4">
            <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center"
            >
            <Upload size={16} className="mr-2" />
            {isLoading ? 'Analyzing...' : 'Upload Image'}
            </button>
            <div className="flex items-center space-x-1 bg-black/20 p-1 rounded-lg border border-border-primary">
                <button onClick={() => setAnalysisMode('detection')} className={`px-2 py-1 rounded-md text-sm flex items-center ${analysisMode === 'detection' ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}><Scan size={14} className="mr-1.5"/>Detection</button>
                <button onClick={() => setAnalysisMode('caption')} className={`px-2 py-1 rounded-md text-sm flex items-center ${analysisMode === 'caption' ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5'}`}><MessageSquare size={14} className="mr-1.5"/>Caption</button>
            </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-h-[300px]">
          <div className="relative bg-black/20 rounded-md border border-gray-700 aspect-square flex items-center justify-center">
            {imageUrl ? (
              <>
                <img ref={imageRef} src={imageUrl} alt="Uploaded" className="max-w-full max-h-full object-contain rounded-md" />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
              </>
            ) : (
              <p className="text-sm text-gray-500">Image preview</p>
            )}
          </div>
          <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700 h-full flex flex-col">
            <h5 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                <BrainCircuit size={16} className="mr-2 text-indigo-400"/>
                AI Analysis ({analysisMode === 'caption' ? 'Captioning' : 'Object Detection'})
            </h5>
            <div className="flex-grow flex flex-col items-center justify-center">
                {isLoading && <Loader />}
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                {caption && analysisMode === 'caption' && (
                    <div className="flex flex-col items-center text-center animate-fade-in">
                        <p className="text-lg text-indigo-300 font-semibold">"{caption}"</p>
                        <button 
                            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(caption)}`, '_blank')}
                            className="mt-4 flex items-center px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-full border border-blue-500/50 transition-colors text-xs font-bold"
                        >
                            <Search size={14} className="mr-1.5"/>
                            Google Search Context
                        </button>
                    </div>
                )}
                {detectedObjects.length > 0 && analysisMode === 'detection' && (
                    <div className="w-full max-h-64 overflow-y-auto pr-2">
                        <ul className="space-y-1 text-sm">
                            {detectedObjects.map((obj, i) => (
                                <li key={i} className="flex justify-between items-center bg-gray-900/50 p-1.5 rounded-md">
                                    <span className="text-text-primary capitalize">{obj.class}</span>
                                    <span className="font-mono text-cyan-300 text-xs">{(obj.score * 100).toFixed(1)}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {!isLoading && !error && !caption && detectedObjects.length === 0 && <p className="text-sm text-gray-500 text-center">Analysis results will appear here.</p>}
            </div>
          </div>
        </div>
         <p className="text-xs text-text-secondary mt-2">
            Active Vision Core: <span className="font-mono text-accent-primary">{analysisMode === 'caption' ? visionModel : 'coco-ssd (TF.js)'}</span>
        </p>
      </div>
    </div>
  );
};

export default ImageAnalyzer;