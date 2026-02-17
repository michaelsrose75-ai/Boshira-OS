import React, { useState } from 'react';
import type { FounderProfile, FounderSkill } from '../types';
import { Brain, Plus, Trash2 } from 'lucide-react';

interface FounderSkillsProps {
  profile: FounderProfile;
  onProfileUpdate: (newProfile: FounderProfile) => void;
}

const FounderSkills: React.FC<FounderSkillsProps> = ({ profile, onProfileUpdate }) => {
  const [newSkillName, setNewSkillName] = useState('');

  const handleAddSkill = () => {
    if (newSkillName.trim() === '') return;
    const newSkill: FounderSkill = {
      id: new Date().toISOString(),
      name: newSkillName.trim(),
      proficiency: 'Competent',
    };
    onProfileUpdate({ ...profile, skills: [...profile.skills, newSkill] });
    setNewSkillName('');
  };

  const handleUpdateSkill = (id: string, newProficiency: FounderSkill['proficiency']) => {
    const updatedSkills = profile.skills.map(skill =>
      skill.id === id ? { ...skill, proficiency: newProficiency } : skill
    );
    onProfileUpdate({ ...profile, skills: updatedSkills });
  };

  const handleDeleteSkill = (id: string) => {
    onProfileUpdate({ ...profile, skills: profile.skills.filter(skill => skill.id !== id) });
  };

  const proficiencyOptions: FounderSkill['proficiency'][] = ['Novice', 'Competent', 'Expert'];

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-600">
      <h4 className="font-semibold text-white mb-4 flex items-center"><Brain size={18} className="mr-2"/>Founder Skill Profile</h4>
      <div className="space-y-3 mb-4">
        {profile.skills.map(skill => (
          <div key={skill.id} className="grid grid-cols-[1fr,auto,auto] gap-2 items-center">
            <p className="text-gray-300 font-medium">{skill.name}</p>
            <select
              value={skill.proficiency}
              onChange={(e) => handleUpdateSkill(skill.id, e.target.value as FounderSkill['proficiency'])}
              className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1 text-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {proficiencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button onClick={() => handleDeleteSkill(skill.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Add a new skill (e.g., SEO)"
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button onClick={handleAddSkill} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"><Plus size={20}/></button>
      </div>
    </div>
  );
};

export default FounderSkills;