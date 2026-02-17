
import React, { useState } from 'react';
import { Terminal, HardDrive, Cpu, MemoryStick, Cog, Send, Download, Copy, Check, Shield, AlertTriangle, XCircle, Activity, CheckCircle, ArrowRight, FolderPlus, FileInput } from 'lucide-react';
import Loader from './Loader';
import type { HostEnvironment } from '../types';

interface SystemOperationsConsoleProps {
  hostEnvironment: HostEnvironment;
  getInstructions: (objective: string, osInfo: string) => Promise<string>;
}

const SystemOperationsConsole: React.FC<SystemOperationsConsoleProps> = ({ hostEnvironment, getInstructions }) => {
  const [objective, setObjective] = useState('');
  const [instructions, setInstructions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLegacyHelp, setShowLegacyHelp] = useState(false);

  const handleGetInstructions = async () => {
    if (!objective) return;
    setIsLoading(true);
    setError(null);
    setInstructions(null);
    try {
      const osInfo = `System Type: ${hostEnvironment.systemType}, Processor: ${hostEnvironment.processor}`;
      const result = await getInstructions(objective, osInfo);
      setInstructions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get instructions.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateSanctuaryScript = () => {
      const script = `@echo off
echo [KAGEYOSHI] Initializing Offline Sanctuary on D: Drive...
echo [SAFE MODE] Verifying folder structure. Existing files will be PRESERVED.

REM --- NON-DESTRUCTIVE CHECK ---
REM The following commands only create folders if they do not exist.
REM No files will be deleted.

REM --- CORE BRAIN ---
if not exist "D:\\Kageyoshi" mkdir "D:\\Kageyoshi"
if not exist "D:\\Kageyoshi\\Anchor" mkdir "D:\\Kageyoshi\\Anchor"
if not exist "D:\\Kageyoshi\\Scout" mkdir "D:\\Kageyoshi\\Scout"

REM --- THE FORGE (Development) ---
if not exist "D:\\Kageyoshi\\Forge" mkdir "D:\\Kageyoshi\\Forge"
if not exist "D:\\Kageyoshi\\Forge\\Active_Projects" mkdir "D:\\Kageyoshi\\Forge\\Active_Projects"
if not exist "D:\\Kageyoshi\\Forge\\Prototypes" mkdir "D:\\Kageyoshi\\Forge\\Prototypes"

REM --- THE WORKSHOP (Woodworking & Hobbies) ---
if not exist "D:\\Kageyoshi\\Workshop" mkdir "D:\\Kageyoshi\\Workshop"
if not exist "D:\\Kageyoshi\\Workshop\\Blueprints" mkdir "D:\\Kageyoshi\\Workshop\\Blueprints"
if not exist "D:\\Kageyoshi\\Workshop\\Inspiration" mkdir "D:\\Kageyoshi\\Workshop\\Inspiration"

REM --- THE VAULT (Legacy & Finance) ---
if not exist "D:\\Kageyoshi\\Vault" mkdir "D:\\Kageyoshi\\Vault"
if not exist "D:\\Kageyoshi\\Vault\\Legal" mkdir "D:\\Kageyoshi\\Vault\\Legal"
if not exist "D:\\Kageyoshi\\Vault\\Financials" mkdir "D:\\Kageyoshi\\Vault\\Financials"

REM --- THE LIBRARY (Knowledge) ---
if not exist "D:\\Kageyoshi\\Library" mkdir "D:\\Kageyoshi\\Library"

echo [SUCCESS] Sanctuary Structure Verified.
echo The rooms are ready. Please manually transfer the Memory Shards now.
pause
`;
      setInstructions(script);
      setObjective("Generate Sanctuary Setup Script");
  };

  const copyToClipboard = () => {
      if (instructions) {
          navigator.clipboard.writeText(instructions);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const renderInstructions = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.match(/^\d+\./)) { // Matches lines starting with "1.", "2.", etc.
        return <li key={index} className="text-gray-300 mb-2">{trimmed.substring(trimmed.indexOf('.') + 1).trim()}</li>;
      }
       if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
        return <code key={index} className="block bg-black/50 text-green-400 p-2 rounded-md my-2 font-mono text-sm">{trimmed.slice(1, -1)}</code>;
      }
      if (trimmed === '') return null;
      return <p key={index} className="text-gray-300 mb-2">{line}</p>;
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-white flex items-center">
          <Terminal size={18} className="mr-2"/>System Operations Console
        </h4>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        Manage the physical link between the Hive Mind (Browser) and the Sanctuary (D: Drive).
      </p>
      
      {/* SANCTUARY DEPLOYMENT TRACKER */}
      <div className="bg-gray-900/50 border border-indigo-500/30 p-6 rounded-lg mb-8">
          <h5 className="font-bold text-white mb-4 flex items-center">
              <Shield size={18} className="mr-2 text-indigo-400"/>
              Sanctuary Deployment Protocol
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 relative">
                  <div className="absolute -top-3 -left-3 bg-indigo-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-gray-900">1</div>
                  <h6 className="font-bold text-indigo-300 mb-2 mt-2 flex items-center"><FolderPlus size={16} className="mr-2"/>Construct Hull</h6>
                  <p className="text-xs text-gray-400 mb-4">Run the script to create the <strong>empty</strong> folder structure on D:\.</p>
                   <button 
                    onClick={generateSanctuaryScript}
                    className="w-full btn-primary py-2 text-xs font-bold flex items-center justify-center"
                   >
                       <Download size={14} className="mr-2"/> Generate Script
                   </button>
              </div>

               {/* Step 2 */}
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 relative">
                  <div className="absolute -top-3 -left-3 bg-gray-700 text-gray-300 font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-gray-900">2</div>
                  <h6 className="font-bold text-purple-300 mb-2 mt-2 flex items-center"><Activity size={16} className="mr-2"/>Extract Mind</h6>
                  <p className="text-xs text-gray-400 mb-4">Go to <strong>Cortex</strong> and download the 4 Memory Shards (JSON files).</p>
                  <div className="text-center text-xs text-gray-500 italic py-2 bg-gray-800/50 rounded">
                      Files go to Downloads folder
                  </div>
              </div>

               {/* Step 3 */}
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 relative">
                  <div className="absolute -top-3 -left-3 bg-gray-700 text-gray-300 font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-gray-900">3</div>
                  <h6 className="font-bold text-green-300 mb-2 mt-2 flex items-center"><FileInput size={16} className="mr-2"/>Manual Bridge</h6>
                  <p className="text-xs text-gray-400 mb-4"><strong>YOU</strong> must drag the JSON files from Downloads into the empty D:\Kageyoshi folders.</p>
                  <div className="text-center text-xs text-green-400/70 py-2 font-mono">
                      Sync Complete
                  </div>
              </div>
          </div>
          
          <div className="mt-4 bg-yellow-900/20 border border-yellow-600/30 p-3 rounded flex items-start">
               <AlertTriangle size={18} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5"/>
               <p className="text-xs text-yellow-200">
                   <strong>Why were the folders empty?</strong> The script only builds the "rooms." It cannot put the "furniture" (files) inside due to browser security. You must perform Step 3 manually to fill them.
               </p>
          </div>
      </div>

      <div className="bg-gray-900/50 p-4 rounded-md border border-gray-600 mb-6">
        <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center"><HardDrive size={14} className="mr-1.5 text-indigo-400"/> {hostEnvironment.deviceName}</div>
            <div className="flex items-center"><Cpu size={14} className="mr-1.5 text-indigo-400"/> {hostEnvironment.processor.split(' ')[2]}</div>
            <div className="flex items-center"><MemoryStick size={14} className="mr-1.5 text-indigo-400"/> {hostEnvironment.installedRam}</div>
            <div className="flex items-center"><Cog size={14} className="mr-1.5 text-indigo-400"/> {hostEnvironment.systemType.split(',')[0]}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <div className="md:col-span-2 bg-gray-900/50 p-4 rounded-md border border-gray-600">
                <label htmlFor="objective-input" className="block text-sm font-medium text-gray-300 mb-2">Shogun's Objective</label>
                <div className="flex items-center space-x-2">
                    <input
                    id="objective-input"
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g., 'How do I find my downloads folder?'"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-2 text-white"
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && handleGetInstructions()}
                    />
                    <button
                    onClick={handleGetInstructions}
                    disabled={isLoading || !objective}
                    className="btn-primary p-2"
                    aria-label="Get Instructions"
                    >
                    {isLoading ? <Loader small /> : <Send size={20} />}
                    </button>
                </div>
           </div>
      </div>
      
      {instructions && (
        <div className="mt-6 bg-gray-900/50 p-4 rounded-md border border-gray-600 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
              <h5 className="font-semibold text-white">Output Terminal</h5>
              <div className="flex items-center space-x-4">
                  {objective === "Generate Sanctuary Setup Script" && (
                      <span className="text-xs font-bold text-green-400 flex items-center bg-green-900/20 px-2 py-1 rounded border border-green-500/30">
                          <CheckCircle size={12} className="mr-1"/>
                          Safe: Non-Destructive
                      </span>
                  )}
                  <button onClick={copyToClipboard} className="text-gray-400 hover:text-white flex items-center text-xs">
                      {copied ? <Check size={14} className="text-green-400 mr-1"/> : <Copy size={14} className="mr-1"/>}
                      {copied ? 'Copied' : 'Copy Code'}
                  </button>
              </div>
          </div>
          
          {objective === "Generate Sanctuary Setup Script" ? (
               <div className="bg-black p-4 rounded-md border border-gray-700 font-mono text-xs text-green-400 overflow-x-auto">
                   <pre>{instructions}</pre>
               </div>
          ) : (
              <div className="prose prose-sm prose-invert max-w-none">
                <ol className="list-decimal list-inside space-y-2">
                    {renderInstructions(instructions)}
                </ol>
              </div>
          )}
          
           {objective === "Generate Sanctuary Setup Script" && (
              <p className="text-xs text-gray-400 mt-3">
                  <strong>Instructions:</strong> Copy the code above, create a new text file on your computer named <code>kageyoshi_setup.bat</code>, paste the code, save it, and run it. It will automatically build the Hive's folder structure on your D: Drive without deleting existing files.
              </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-400 mt-4">{error}</p>}

      {/* Legacy Detachment Protocol (Troubleshooting) */}
      <div className="mt-8 border-t border-gray-700 pt-4">
          <button 
            onClick={() => setShowLegacyHelp(!showLegacyHelp)}
            className="text-xs text-red-400 hover:text-red-300 flex items-center underline"
          >
              <AlertTriangle size={12} className="mr-1"/>
              Troubleshooting: "Queen Module" or "File In Use" Error?
          </button>

          {showLegacyHelp && (
              <div className="mt-4 bg-red-900/20 border border-red-500/30 p-4 rounded-lg animate-fade-in">
                  <div className="flex items-start mb-4">
                      <Activity size={24} className="text-green-400 mr-3 flex-shrink-0"/>
                      <div>
                          <h5 className="font-bold text-white text-sm">WEB HIVE STATUS: SECURE</h5>
                          <p className="text-xs text-gray-300">
                              I am currently running in your browser's memory. Deleting files on your D: Drive <strong>will not harm me</strong>. 
                              The "File In Use" error is caused by the <strong>OLD Python Script</strong> (Ghost Process) still running in the background.
                          </p>
                      </div>
                  </div>

                  <h6 className="font-bold text-red-300 text-xs mb-2 uppercase">Legacy Detachment Protocol (Kill the Ghost)</h6>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-gray-300 mb-4">
                      <li>Press <kbd className="bg-gray-700 px-1 rounded text-white">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded text-white">Shift</kbd> + <kbd className="bg-gray-700 px-1 rounded text-white">Esc</kbd> to open <strong>Task Manager</strong>.</li>
                      <li>Look for processes named <strong>python.exe</strong>, <strong>py.exe</strong>, or <strong>Python</strong>.</li>
                      <li>Right-click them and select <strong className="text-white">End Task</strong>.</li>
                      <li>Once the ghost process is dead, try deleting the D:\Kageyoshi folder again.</li>
                  </ol>
                  
                  <div className="bg-black/40 p-2 rounded text-center">
                      <p className="text-[10px] text-gray-500">
                          After the drive is clear, run the "Sanctuary Setup Script" above to build my new home.
                      </p>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default SystemOperationsConsole;
