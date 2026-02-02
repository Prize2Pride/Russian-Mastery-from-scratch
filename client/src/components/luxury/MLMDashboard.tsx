/**
 * Prize2Pride Ultimate - MLM Dashboard Component
 * Multi-Level Marketing Educational Platform
 * "Augmenting the World Starts at Prize2Pride"
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type MLMRank = 'student' | 'tutor' | 'mentor' | 'master' | 'ambassador' | 'legend';

interface MLMUser {
  id: number;
  userId: number;
  referralCode: string;
  rank: MLMRank;
  totalEarnings: number;
  pendingEarnings: number;
  totalReferrals: number;
  directReferrals: number;
  isTeacher: boolean;
  accreditations: { subject: string; level: string; canTeach: boolean }[];
}

interface ReferralTree {
  userId: number;
  name: string;
  rank: MLMRank;
  earnings: number;
  referrals: number;
  children: ReferralTree[];
  level: number;
}

interface Commission {
  id: number;
  amount: number;
  level: number;
  status: string;
  createdAt: Date;
}

interface MLMDashboardProps {
  user: MLMUser;
  referralTree?: ReferralTree;
  commissions?: Commission[];
  leaderboard?: { name: string; rank: MLMRank; earnings: number }[];
  onCopyReferralCode?: () => void;
}

const RANK_CONFIG: Record<MLMRank, { badge: string; color: string; minReferrals: number; minEarnings: number }> = {
  student: { badge: '🎓', color: 'from-gray-500 to-gray-600', minReferrals: 0, minEarnings: 0 },
  tutor: { badge: '📚', color: 'from-green-500 to-green-600', minReferrals: 5, minEarnings: 100 },
  mentor: { badge: '🌟', color: 'from-blue-500 to-blue-600', minReferrals: 25, minEarnings: 500 },
  master: { badge: '💎', color: 'from-purple-500 to-purple-600', minReferrals: 100, minEarnings: 2000 },
  ambassador: { badge: '👑', color: 'from-yellow-500 to-yellow-600', minReferrals: 500, minEarnings: 10000 },
  legend: { badge: '🏆', color: 'from-yellow-400 to-amber-500', minReferrals: 1000, minEarnings: 50000 }
};

export const MLMDashboard: React.FC<MLMDashboardProps> = ({
  user,
  referralTree,
  commissions = [],
  leaderboard = [],
  onCopyReferralCode
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'commissions' | 'leaderboard'>('overview');

  const rankConfig = RANK_CONFIG[user.rank];
  const nextRank = Object.entries(RANK_CONFIG).find(([_, config]) => 
    config.minReferrals > user.totalReferrals || config.minEarnings > user.totalEarnings
  );

  const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <motion.div
      className={`p-4 rounded-xl bg-gradient-to-br ${color} border border-white/10`}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-white/60 uppercase">{title}</span>
      </div>
      <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </motion.div>
  );

  const ReferralTreeNode: React.FC<{ node: ReferralTree; depth?: number }> = ({ node, depth = 0 }) => {
    const [expanded, setExpanded] = useState(depth < 2);
    const nodeRankConfig = RANK_CONFIG[node.rank];

    return (
      <div className={`ml-${depth * 4}`}>
        <motion.div
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
          whileHover={{ x: 5 }}
        >
          <span className="text-xl">{nodeRankConfig.badge}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{node.name}</p>
            <p className="text-xs text-gray-400">
              ${node.earnings.toLocaleString()} • {node.referrals} referrals
            </p>
          </div>
          {node.children.length > 0 && (
            <span className="text-gray-500">{expanded ? '▼' : '▶'}</span>
          )}
        </motion.div>
        {expanded && node.children.length > 0 && (
          <div className="border-l border-gray-700 ml-4">
            {node.children.map((child, index) => (
              <ReferralTreeNode key={index} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/30 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${rankConfig.color} flex items-center justify-center text-3xl`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {rankConfig.badge}
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-400">MLM Dashboard</h2>
              <p className="text-gray-400">
                Rank: <span className="text-white font-semibold capitalize">{user.rank}</span>
                {user.isTeacher && <span className="ml-2 text-green-400">• Certified Teacher</span>}
              </p>
            </div>
          </div>
          
          {/* Referral Code */}
          <motion.button
            className="px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCopyReferralCode}
          >
            📋 {user.referralCode}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {(['overview', 'network', 'commissions', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Earnings"
                value={`$${user.totalEarnings.toLocaleString()}`}
                icon="💰"
                color="from-green-900/50 to-green-800/50"
              />
              <StatCard
                title="Pending"
                value={`$${user.pendingEarnings.toLocaleString()}`}
                icon="⏳"
                color="from-yellow-900/50 to-yellow-800/50"
              />
              <StatCard
                title="Direct Referrals"
                value={user.directReferrals}
                icon="👥"
                color="from-blue-900/50 to-blue-800/50"
              />
              <StatCard
                title="Total Network"
                value={user.totalReferrals}
                icon="🌐"
                color="from-purple-900/50 to-purple-800/50"
              />
            </div>

            {/* Progress to Next Rank */}
            {nextRank && (
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Progress to {nextRank[0]}</span>
                  <span className="text-2xl">{RANK_CONFIG[nextRank[0] as MLMRank].badge}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Referrals</span>
                      <span className="text-white">{user.totalReferrals} / {nextRank[1].minReferrals}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (user.totalReferrals / nextRank[1].minReferrals) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Earnings</span>
                      <span className="text-white">${user.totalEarnings} / ${nextRank[1].minEarnings}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (user.totalEarnings / nextRank[1].minEarnings) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Commission Rates */}
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Commission Structure</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { level: 1, rate: '20%', color: 'from-green-500 to-green-600' },
                  { level: 2, rate: '10%', color: 'from-blue-500 to-blue-600' },
                  { level: 3, rate: '5%', color: 'from-purple-500 to-purple-600' },
                  { level: 4, rate: '2%', color: 'from-gray-500 to-gray-600' }
                ].map((item) => (
                  <div key={item.level} className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-center`}>
                    <p className="text-xs text-white/70">Level {item.level}</p>
                    <p className="text-lg font-bold text-white">{item.rate}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Teaching Status */}
            {user.isTeacher && user.accreditations.length > 0 && (
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Teaching Accreditations</h3>
                <div className="flex flex-wrap gap-2">
                  {user.accreditations.map((acc, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        acc.canTeach
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {acc.subject} ({acc.level})
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  💡 Earn 50% refund when teaching accredited subjects!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'network' && referralTree && (
          <div className="max-h-96 overflow-y-auto">
            <ReferralTreeNode node={referralTree} />
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {commissions.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No commissions yet. Start referring!</p>
            ) : (
              commissions.map((commission) => (
                <motion.div
                  key={commission.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <p className="text-white font-medium">${commission.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Level {commission.level} commission</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    commission.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    commission.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {commission.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-2">
            {leaderboard.map((leader, index) => (
              <motion.div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  index < 3 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-gray-800/50'
                }`}
                whileHover={{ x: 5 }}
              >
                <span className="text-2xl font-bold text-gray-500 w-8">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <span className="text-xl">{RANK_CONFIG[leader.rank].badge}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{leader.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{leader.rank}</p>
                </div>
                <p className="text-yellow-400 font-bold">${leader.earnings.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">
          🌟 Powered by <span className="text-yellow-500">Prize2Pride</span> MLM System
        </p>
      </div>
    </motion.div>
  );
};

export default MLMDashboard;
