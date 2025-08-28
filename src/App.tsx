import { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { User, Mail, DollarSign, ArrowLeft, Youtube, LogIn, Lock } from 'lucide-react';

// --- ANALYTICS DATA GENERATION ---

// Helper to create daily data points for a month
const generateMonthlyData = (days: number, startValue: number, gain: number, namePrefix: string) => 
    Array.from({ length: days }, (_, i) => ({ 
        name: `${namePrefix} D${i + 1}`, 
        value: startValue + Math.floor(i * (gain / days)) 
    }));

const generateMonthlyViewData = (days: number, totalViews: number, namePrefix: string) =>
    Array.from({ length: days }, (_, i) => ({
        name: `${namePrefix} D${i + 1}`,
        value: Math.floor(totalViews / days) + (Math.random() - 0.5) * (totalViews / days / 5) // with 20% variance
    }));
    
const generateMonthlyRevenueData = (days: number, totalViews: number, namePrefix: string) =>
    Array.from({ length: days }, (_, i) => ({
        name: `${namePrefix} D${i + 1}`,
        value: ((totalViews / days) / 1000 * 0.15) + (Math.random() - 0.5) * 2
    }));

// --- KAI GUY DATA PREPARATION ---
const kaiGuyYearlyRaw = {
    subs: { 'Aug 24': 18000, 'Sep 24': 20000, 'Oct 24': 40000, 'Nov 24': 15000, 'Dec 24': 25000, 'Jan 25': 100000, 'Feb 25': 25000, 'Mar 25': 20000, 'Apr 25': 40000, 'May 25': 40000, 'Jun 25': 85000, 'Jul 25': 30000 },
    views: { 'Aug 24': 3100000, 'Sep 24': 3520405, 'Oct 24': 2965876, 'Nov 24': 1082983, 'Dec 24': 2084960, 'Jan 25': 1553483, 'Feb 25': 867140, 'Mar 25': 1491142, 'Apr 25': 2142874, 'May 25': 1834790, 'Jun 25': 6063982, 'Jul 25': 5375341 },
};
let kg_end_subs = 2000000;
const kg_yearly_subs_reversed = Object.entries(kaiGuyYearlyRaw.subs).reverse().map(([month, gain]) => {
    const start = kg_end_subs - gain;
    const data = generateMonthlyData(30, start, gain, month);
    kg_end_subs = start;
    return data;
});
const kg_yearly_subs = kg_yearly_subs_reversed.flat().reverse();

const kg_yearly_views = Object.entries(kaiGuyYearlyRaw.views).map(([month, total]) => generateMonthlyViewData(30, total, month)).flat();
const kg_yearly_revenue = Object.entries(kaiGuyYearlyRaw.views).map(([month, total]) => generateMonthlyRevenueData(30, total, month)).flat();

const kaiGuySpecificAnalytics = {
    '30d': {
        subscribers: generateMonthlyData(30, 1970000, 30000, 'Jul'),
        views: generateMonthlyViewData(30, 5375341, 'Jul'),
        revenue: generateMonthlyRevenueData(30, 5375341, 'Jul'),
    },
    '90d': {
        subscribers: [ ...generateMonthlyData(31, 1885000, 40000, 'May'), ...generateMonthlyData(30, 1925000, 85000, 'Jun'), ...generateMonthlyData(30, 1970000, 30000, 'Jul') ],
        views: [ ...generateMonthlyViewData(31, 1834790, 'May'), ...generateMonthlyViewData(30, 6063982, 'Jun'), ...generateMonthlyViewData(30, 5375341, 'Jul') ],
        revenue: [ ...generateMonthlyRevenueData(31, 1834790, 'May'), ...generateMonthlyRevenueData(30, 6063982, 'Jun'), ...generateMonthlyRevenueData(30, 5375341, 'Jul') ],
    },
    '1y': { subscribers: kg_yearly_subs, views: kg_yearly_views, revenue: kg_yearly_revenue },
};

// --- FOOTBALL TIME DATA PREPARATION ---
const ftYearlyRaw = {
    subs: { 'Aug 24': 5000, 'Sep 24': 7000, 'Oct 24': 11000, 'Nov 24': 8000, 'Dec 24': 10000, 'Jan 25': 1000, 'Feb 25': 2000, 'Mar 25': 3000, 'Apr 25': 5000, 'May 25': 7000, 'Jun 25': 5000, 'Jul 25': 5000 },
    views: { 'Aug 24': 4800000, 'Sep 24': 5300000, 'Oct 24': 7100000, 'Nov 24': 6200000, 'Dec 24': 4500000, 'Jan 25': 5872374, 'Feb 25': 2846832, 'Mar 25': 10221474, 'Apr 25': 32972125, 'May 25': 31920559, 'Jun 25': 24295842, 'Jul 25': 2877786 },
};
let ft_end_subs = 782000;
const ft_yearly_subs_reversed = Object.entries(ftYearlyRaw.subs).reverse().map(([month, gain]) => {
    const start = ft_end_subs - gain;
    const data = generateMonthlyData(30, start, gain, month);
    ft_end_subs = start;
    return data;
});
const ft_yearly_subs = ft_yearly_subs_reversed.flat().reverse();
const ft_yearly_views = Object.entries(ftYearlyRaw.views).map(([month, total]) => generateMonthlyViewData(30, total, month)).flat();
const ft_yearly_revenue = Object.entries(ftYearlyRaw.views).map(([month, total]) => generateMonthlyRevenueData(30, total, month)).flat();

const footballTimeSpecificAnalytics = {
    '30d': {
        subscribers: generateMonthlyData(30, 777000, 5000, 'Jul'),
        views: generateMonthlyViewData(30, 2877786, 'Jul'),
        revenue: generateMonthlyRevenueData(30, 2877786, 'Jul'),
    },
    '90d': {
        subscribers: [ ...generateMonthlyData(31, 770000, 7000, 'May'), ...generateMonthlyData(30, 777000, 5000, 'Jun'), ...generateMonthlyData(30, 782000, 5000, 'Jul') ],
        views: [ ...generateMonthlyViewData(31, 31920559, 'May'), ...generateMonthlyViewData(30, 24295842, 'Jun'), ...generateMonthlyViewData(30, 2877786, 'Jul') ],
        revenue: [ ...generateMonthlyRevenueData(31, 31920559, 'May'), ...generateMonthlyRevenueData(30, 24295842, 'Jun'), ...generateMonthlyRevenueData(30, 2877786, 'Jul') ],
    },
    '1y': { subscribers: ft_yearly_subs, views: ft_yearly_views, revenue: ft_yearly_revenue },
};

// --- CHANNEL & VIDEO DATA ---
const mockChannels = [
  { id: 1, name: 'Kai Guy', category: 'Gaming', subscribers: 2000000, monthlyViews: 5375341, monthlyRevenue: 806, price: 3500, bannerUrl: 'https://placehold.co/1200x300/ff6347/ffffff?text=Kai+Guy', logoUrl: 'https://placehold.co/100x100/ff4500/ffffff?text=KG', channelUrl: 'https://www.youtube.com/@KaiGuyGD', paymentLink: 'https://dashboard.skydo.com/pay/pyl_yPYYbl', seller: { id: 'cb-7a9b1c0f-3d2e', name: 'Avery Callahan', email: 'averycallahan21@gmail.com', avatarUrl: 'https://placehold.co/100x100/333333/ffffff?text=A' }, incomeStreams: ['AdSense', 'Sponsorships', 'Affiliate Links'], hasLongVideos: true, hasShorts: true, },
  { id: 2, name: 'Football Time', category: 'Sports', subscribers: 782000, monthlyViews: 2877786, monthlyRevenue: 432, price: 1800, bannerUrl: 'https://placehold.co/1200x300/228B22/ffffff?text=Football+Time', logoUrl: 'https://placehold.co/100x100/32CD32/ffffff?text=FT', channelUrl: 'https://www.youtube.com/@FootballTime_Live/featured', paymentLink: 'https://dashboard.skydo.com/pay/pyl_NS3Ivr', seller: { id: 'cb-4f8e2a9d-1b3c', name: 'Jordan Whitmore', email: 'Jwhitmore1988@gmail.com', avatarUrl: 'https://placehold.co/100x100/333333/ffffff?text=J' }, incomeStreams: ['AdSense', 'YouTube Premium', 'Fan Donations'], hasLongVideos: false, hasShorts: true, },
];

const kaiGuyVideos = {
    long: [
        { id: 'kg_long_1', title: 'Guess what song PERFECTLY syncs with Skeletal Shenanigans...', views: 63000, likes: 2400 },
        { id: 'kg_long_2', title: '"iSpyWithMyLittleEye" BUT I remade the song with my voice...', views: 810000, likes: 16000 },
        { id: 'kg_long_3', title: '"Skeletal Shenanigans" BUT I remade the song with my voice...', views: 3400000, likes: 58000 },
        { id: 'kg_long_4', title: '"Slaughterhouse" BUT I remade the song with my voice...', views: 259000, likes: 4500 },
        { id: 'kg_long_5', title: '"Tidal Wave" BUT I remade the song with my voice...', views: 82000, likes: 2400 },
        { id: 'kg_long_6', title: 'How To Get Better At Geometry Dash (Beginner ⇨ Top Player Guide)', views: 506000, likes: 15000 },
        { id: 'kg_long_7', title: '10 Levels of Difficulty | Best Of Geometry Dash 2023', views: 578000, likes: 6800 },
        { id: 'kg_long_8', title: 'The WORST EVW Challenge EVER!', views: 118000, likes: 3000 },
        { id: 'kg_long_9', title: '$1 vs $1000 Geometry Dash Level!', views: 320000, likes: 8500 },
        { id: 'kg_long_10', title: "The Story of Geometry Dash's Greatest Player...", views: 200000, likes: 5200 },
        { id: 'kg_long_11', title: 'The ONLY Mod For Geometry Dash On iOS (2024)', views: 1100000, likes: 22000 },
        { id: 'kg_long_12', title: 'the new top 1 is literally free', views: 106000, likes: 3600 },
        { id: 'kg_long_13', title: 'i beat slaughterhouse on mobile lol', views: 358000, likes: 5800 },
        { id: 'kg_long_14', title: '21 Ways To Play Geometry Dash', views: 1700000, likes: 20000 },
        { id: 'kg_long_15', title: '"10 Levels Of Difficulty" | Creator Contest Winners!!', views: 184000, likes: 3200 },
        { id: 'kg_long_16', title: '$1,000 Creator Contest Results!', views: 109000, likes: 2400 },
    ].map(v => ({...v, revenue: Math.round(v.views / 1000 * 0.15), thumbnailUrl: `https://placehold.co/120x90/2c2c3e/ffffff?text=Vid`})),
    shorts: [
        { id: 'kg_short_1', title: 'Geometry Dash 2.2: Attractiveness Test 😭😭', views: 10000000, likes: 421000 },
        { id: 'kg_short_2', title: 'Would You Rather In Geometry Dash 2.2 😳', views: 6300000, likes: 102000 },
        { id: 'kg_short_3', title: "Geometry Dash's Most Awkward Test😳😳😳", views: 3900000, likes: 171000 },
        { id: 'kg_short_4', title: '$1 vs $20,000,000 Choice In Geometry Dash!', views: 840000, likes: 30000 },
        { id: 'kg_short_5', title: '$1 vs $1,000 Geometry Dash Level😱', views: 796000, likes: 31000 },
        { id: 'kg_short_6', title: 'Geometry Dash Pro Player Test! 😱', views: 330000, likes: 13000 },
        { id: 'kg_short_7', title: 'Geometry Dash 2.2: Worthy Or Not Test! 😳', views: 185000, likes: 5600 },
        { id: 'kg_short_8', title: '10 Steps To Become A Geometry Dash Pro!', views: 2500000, likes: 80000 },
        { id: 'kg_short_9', title: '7 Steps To Make A Good Geometry Dash Level!', views: 897000, likes: 23000 },
        { id: 'kg_short_10', title: '1 Minute vs 10 Years Playing Geometry Dash!', views: 2800000, likes: 81000 },
        { id: 'kg_short_11', title: 'Attractiveness Test #2 | Geometry Dash 2.2', views: 1800000, likes: 59000 },
        { id: 'kg_short_12', title: '$500 Wonder Challenge In Geometry Dash!', views: 190000, likes: 5100 },
        { id: 'kg_short_13', title: 'Massage Gun Spam Hack In Geometry Dash!', views: 60000000, likes: 1700000 },
        { id: 'kg_short_14', title: 'EXTREME Spam Challenge In Geometry Dash!', views: 544000, likes: 14000 },
        { id: 'kg_short_15', title: '🏆Level 1 To Level 10 In Geometry Dash!🏆', views: 415000, likes: 7600 },
        { id: 'kg_short_16', title: 'Geometry Dash Increasing Difficulty (Shh🤫)', views: 493000, likes: 11000 },
        { id: 'kg_short_17', title: 'I Failed This Geometry Dash Quiz 😭😭😭', views: 619000, likes: 9400 },
        { id: 'kg_short_18', title: 'Cheater vs Spam Trap for $10k 🐀', views: 201000, likes: 2600 },
        { id: 'kg_short_19', title: 'Hacker vs Spam Challenge 🎯', views: 139000, likes: 1800 },
        { id: 'kg_short_20', title: 'this has to be a joke 💀', views: 836000, likes: 19000 },
    ].map(v => ({...v, revenue: Math.round(v.views / 1000 * 0.15), thumbnailUrl: `https://placehold.co/90x120/3e2c2c/ffffff?text=Short`})),
};

const footballTimeVideos = {
    long: [],
    shorts: [
        { id: 'ft_short_20', title: 'Cheating in Football 👉PART 2', views: 1100000, likes: 11000 }, { id: 'ft_short_19', title: 'Penalty kick from another angle 😲 #5', views: 622000, likes: 5400 }, { id: 'ft_short_18', title: 'When the defender puts on a show #3', views: 53000, likes: 435 }, { id: 'ft_short_17', title: 'Controversial Moments in Football 🤔 PART 6', views: 19000, likes: 176 }, { id: 'ft_short_16', title: 'When Players Celebrate Before Scoring', views: 287000, likes: 3500 }, { id: 'ft_short_15', title: 'Defender level 0-100', views: 18000, likes: 174 }, { id: 'ft_short_14', title: 'Goalkeeper show or regular game 👉 PART 2', views: 88000, likes: 777 }, { id: 'ft_short_13', title: 'Crazy Referee Moments', views: 29000, likes: 312 }, { id: 'ft_short_12', title: 'When the goalkeeper puts on a show 👉 PART 16', views: 44000, likes: 426 }, { id: 'ft_short_11', title: 'Penalty kick from another angle 😲 #6', views: 24000, likes: 214 }, { id: 'ft_short_10', title: 'Goalkeeper show or regular game 👉 PART 3', views: 28000, likes: 345 }, { id: 'ft_short_9', title: 'Rare Penalty Moments', views: 38000, likes: 413 }, { id: 'ft_short_8', title: 'When the goalkeeper puts on a show 👉 PART 17', views: 188000, likes: 2200 }, { id: 'ft_short_7', title: 'IQ 999 in Football 😑', views: 24000, likes: 369 }, { id: 'ft_short_6', title: 'Beyond VAR', views: 7500, likes: 79 }, { id: 'ft_short_5', title: 'When the goalkeeper puts on a show 👉 PART 18', views: 51000, likes: 674 }, { id: 'ft_short_4', title: 'When a player makes a show 😎', views: 27000, likes: 503 }, { id: 'ft_short_3', title: 'High IQ in Football 😬', views: 33000, likes: 421 }, { id: 'ft_short_2', title: 'When the goalkeeper puts on a show 👉 PART 19', views: 44000, likes: 724 }, { id: 'ft_short_1', title: '1 in a Trillion Moments in Football 👉 PART 8', views: 26000, likes: 613 },
    ].map(v => ({...v, revenue: Math.round(v.views / 1000 * 0.15), thumbnailUrl: `https://placehold.co/90x120/3e2c2c/ffffff?text=Short`}))
};

// --- HELPER COMPONENTS ---
const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (<div className="p-2 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700"><p className="label">{`${label} : ${formatNumber(payload[0].value)}`}</p></div>);
  }
  return null;
};

// --- PAGE COMPONENTS ---
function LoginPage({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Log in regardless of email or password, as long as fields are not empty
        onLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4"><Youtube className="text-blue-500" size={40} /><h1 className="text-3xl font-bold ml-2 text-white">Channel Boosters</h1></div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2><p className="text-gray-400">Sign in to access the marketplace dashboard.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Email Address</label>
                        <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required /></div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-300 block mb-2">Password</label>
                        <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required /></div>
                    </div>
                    <div><button type="submit" className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"><LogIn size={20} className="mr-2" />Sign In</button></div>
                </form>
            </div>
        </div>
    );
}

function DashboardPage({ onSelectChannel, onLogout }: { onSelectChannel: (channel: any) => void, onLogout: () => void }) {
    return (
        <><Header onLogout={onLogout} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-12"><h2 className="text-3xl font-bold text-white mb-2">Welcome to your Dashboard</h2><p className="text-lg text-gray-400">Here are the channels currently available for acquisition.</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {mockChannels.map(channel => (
                        <div key={channel.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 group">
                            <img src={channel.bannerUrl} alt={`${channel.name} banner`} className="w-full h-32 object-cover" />
                            <div className="p-6">
                                <div className="flex items-center mb-4"><img src={channel.logoUrl} alt={`${channel.name} logo`} className="w-20 h-20 rounded-full border-4 border-gray-700 -mt-16" /><div className="ml-4"><h3 className="text-2xl font-bold text-white">{channel.name}</h3><p className="text-md text-blue-400 font-semibold">{channel.category}</p></div></div>
                                <div className="space-y-3 text-gray-300 mb-6">
                                    <div className="flex justify-between items-center"><span className="text-gray-400">Subscribers</span><span className="font-bold text-white">{formatNumber(channel.subscribers)}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-400">Monthly Views</span><span className="font-bold text-white">{formatNumber(channel.monthlyViews)}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-400">Monthly Revenue</span><span className="font-bold text-green-400">${formatNumber(channel.monthlyRevenue)}</span></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-white mb-4">${channel.price.toLocaleString()}</p>
                                     <div className="flex items-center gap-4">
                                        <button onClick={() => window.open(channel.channelUrl, '_blank')} className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">Visit Channel</button>
                                        <button onClick={() => onSelectChannel(channel)} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300">View Analytics</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function ChannelDetails({ channel, onBack }: { channel: any, onBack: () => void }) {
    const [timeframe, setTimeframe] = useState('30d');
    const [videoType, setVideoType] = useState(channel.hasLongVideos ? 'long' : 'shorts');
    const [ownerEmail, setOwnerEmail] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    const analyticsData = channel.id === 1 ? kaiGuySpecificAnalytics : footballTimeSpecificAnalytics;
    const videoData = channel.id === 1 ? kaiGuyVideos : footballTimeVideos;
    const data = analyticsData[timeframe as keyof typeof analyticsData] || analyticsData['30d'];

    const handlePayNow = () => {
        if (ownerEmail.includes('@') && ownerEmail.includes('.')) {
            setShowPaymentModal(true);
        } else {
            alert("Please enter a valid email address.");
        }
    };
    
    const handleProceedToPayment = () => {
        window.open(channel.paymentLink, '_blank');
        setShowPaymentModal(false);
    };

    const timeframes = [{ key: '30d', label: 'Last 30 Days' }, { key: '90d', label: 'Last 90 Days' }, { key: '1y', label: 'Last Year' }];

    return (
        <><Header onBack={onBack} isDetailsPage={true} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
                <div className="relative mb-8"><img src={channel.bannerUrl} alt="Channel Banner" className="w-full h-48 md:h-64 object-cover rounded-2xl" /><div className="absolute bottom-0 left-8 transform translate-y-1/2"><img src={channel.logoUrl} alt="Channel Logo" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-8 border-gray-900" /></div></div>
                <div className="mt-20 md:mt-24 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div><h1 className="text-4xl font-bold">{channel.name}</h1><p className="text-blue-400 text-lg">{channel.category}</p></div>
                    <button onClick={() => window.open(channel.channelUrl, '_blank')} className="mt-4 md:mt-0 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><Youtube size={20} />Visit Channel</button>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3 space-y-8">
                        <div className="bg-gray-800 p-2 rounded-lg flex items-center justify-center flex-wrap gap-2">
                            {timeframes.map(tf => (<button key={tf.key} onClick={() => setTimeframe(tf.key)} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${timeframe === tf.key ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'}`}>{tf.label}</button>))}
                        </div>
                        <div className="space-y-8">
                            {['subscribers', 'views', 'revenue'].map(metric => (
                                <div key={metric} className="bg-gray-800 p-4 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 capitalize">{metric} Trend</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={data[metric as keyof typeof data]} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <defs><linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={metric === 'subscribers' ? '#3b82f6' : metric === 'views' ? '#8b5cf6' : '#22c55e'} stopOpacity={0.8}/><stop offset="95%" stopColor={metric === 'subscribers' ? '#3b82f6' : metric === 'views' ? '#8b5cf6' : '#22c55e'} stopOpacity={0}/></linearGradient></defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /><XAxis dataKey="name" stroke="#a0aec0" tick={{fontSize: 10}} interval={data[metric as keyof typeof data] && data[metric as keyof typeof data].length > 100 ? 30 : 5} /><YAxis stroke="#a0aec0" tickFormatter={formatNumber} tick={{fontSize: 12}} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="value" stroke={metric === 'subscribers' ? '#3b82f6' : metric === 'views' ? '#8b5cf6' : '#22c55e'} fillOpacity={1} fill={`url(#color${metric})`} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                            <h3 className="text-xl font-semibold mb-4">Recent Videos</h3>
                            {(channel.hasLongVideos && channel.hasShorts) && (
                                <div className="flex border-b border-gray-700 mb-4">
                                    <button onClick={() => setVideoType('long')} className={`py-2 px-4 font-semibold ${videoType === 'long' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Long Videos</button>
                                    <button onClick={() => setVideoType('shorts')} className={`py-2 px-4 font-semibold ${videoType === 'shorts' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>Shorts</button>
                                </div>
                            )}
                            <div className="overflow-x-auto"><table className="w-full text-left"><thead className="text-xs text-gray-400 uppercase"><tr><th className="p-2">Video</th><th className="p-2 text-right">Views</th><th className="p-2 text-right">Likes</th><th className="p-2 text-right">Revenue</th></tr></thead><tbody>{videoData[videoType as keyof typeof videoData].map(video => (<tr key={video.id} className="border-b border-gray-700 hover:bg-gray-700/50"><td className="p-2 flex items-center"><img src={video.thumbnailUrl} alt={video.title} className="w-16 h-12 object-cover rounded-md mr-4" /><span className="font-medium truncate max-w-xs">{video.title}</span></td><td className="p-2 text-right">{formatNumber(video.views)}</td><td className="p-2 text-right">{formatNumber(video.likes)}</td><td className="p-2 text-right text-green-400">${video.revenue}</td></tr>))}</tbody></table></div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3"><div className="sticky top-24 space-y-6">
                        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                            <p className="text-gray-400">Asking Price</p><p className="text-4xl font-bold text-white mb-6">${channel.price.toLocaleString()}</p>
                            <div className="space-y-4">
                                <div><label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-300 mb-1">Your Receiving Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" id="ownerEmail" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="Email for channel transfer" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>
                                <button onClick={handlePayNow} disabled={!ownerEmail} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"><DollarSign size={20} className="mr-2" />Pay Now</button>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                           <h3 className="text-lg font-semibold mb-4">How to Buy This Channel</h3>
                           <ol className="list-decimal list-inside space-y-3 text-gray-300"><li>Enter the email address where you wish to receive channel ownership.</li><li>Click "Pay Now" to be redirected to our secure payment gateway.</li><li>Complete the payment. Your funds are held in escrow.</li><li>Channel transfer begins. This typically takes 1-2 hours (max 24 hours).</li><li>Once you confirm ownership, funds are released to the seller.</li></ol>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                            <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                            <div className="flex items-center mb-4"><img src={channel.seller.avatarUrl} alt="Seller Avatar" className="w-16 h-16 rounded-full mr-4" /><div><p className="font-bold text-xl">{channel.seller.name}</p><p className="text-sm text-gray-400">Member since 2022</p></div></div>
                            <div className="space-y-2 text-gray-300"><p className="flex items-center"><User size={16} className="mr-2 text-gray-500"/>ID: {channel.seller.id}</p><p className="flex items-center"><Mail size={16} className="mr-2 text-gray-500"/>{channel.seller.email}</p></div>
                             <button className="w-full mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Contact Seller</button>
                        </div>
                    </div></div>
                </div>
                {showPaymentModal && (<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"><div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-700"><h2 className="text-2xl font-bold mb-4">Payment Confirmation</h2><p className="text-gray-300 mb-2">You are about to purchase</p><p className="text-xl font-semibold text-blue-400 mb-6">{channel.name} for ${channel.price.toLocaleString()}</p><p className="text-gray-400 text-sm mb-6">You will now be redirected to our secure payment partner to complete the transaction.</p><div className="flex justify-center gap-4"><button onClick={() => setShowPaymentModal(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Cancel</button><button onClick={handleProceedToPayment} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Proceed</button></div></div></div>)}
            </div>
        </>
    );
}

function Header({ onBack, onLogout, isDetailsPage }: { onBack?: () => void, onLogout?: () => void, isDetailsPage?: boolean }) {
    return (
        <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50 border-b border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                       {isDetailsPage ? (<button onClick={onBack} className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"><ArrowLeft size={20} className="mr-2" />Back to Dashboard</button>) : (<div className="flex items-center"><Youtube className="text-blue-500" size={32} /><h1 className="text-xl font-bold ml-2">Channel Boosters</h1></div>)}
                    </div>
                    {onLogout && (<button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg">Logout</button>)}
                </div>
            </div>
        </header>
    );
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<any | null>(null);

    useEffect(() => {
        document.body.style.backgroundColor = '#111827';
    }, []);

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);
    const handleSelectChannel = (channel: any) => setSelectedChannel(channel);
    const handleBackToDashboard = () => setSelectedChannel(null);

    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="bg-gray-900 min-h-screen font-sans">
            <main>
                {selectedChannel ? (<ChannelDetails channel={selectedChannel} onBack={handleBackToDashboard} />) : (<DashboardPage onSelectChannel={handleSelectChannel} onLogout={handleLogout} />)}
            </main>
        </div>
    );
}
