// ─── Demo Comments ────────────────────────────────────────────
// Pre-seeded comments for mock posts so the app looks alive in demo mode.

const DEMO_AVATARS = (name) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

export const demoComments = {
    '1': [
        { id: 'dc1a', text: 'This is alarming! I live near Thane Creek and the smell is unbearable. Shared with local authorities.', authorName: 'Neha Deshmukh', authorAvatar: DEMO_AVATARS('Neha'), timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString() },
        { id: 'dc1b', text: 'Maharashtra Pollution Control Board needs to act NOW. This is a clear violation of environmental norms.', authorName: 'Arjun Patil', authorAvatar: DEMO_AVATARS('Arjun'), timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
    ],
    '2': [
        { id: 'dc2a', text: 'AQI 485 is hazardous! We need to stop outdoor activities for children immediately.', authorName: 'Kavita Reddy', authorAvatar: DEMO_AVATARS('Kavita'), timestamp: new Date(Date.now() - 3 * 3600000).toISOString() },
        { id: 'dc2b', text: 'Delhi needs an emergency action plan. This happens every year and nothing changes.', authorName: 'Suresh Kumar', authorAvatar: DEMO_AVATARS('Suresh'), timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString() },
        { id: 'dc2c', text: 'Bought N95 masks for the whole family. Stay safe everyone! 🙏', authorName: 'Priya Bhatia', authorAvatar: DEMO_AVATARS('PriyaB'), timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
    ],
    '3': [
        { id: 'dc3a', text: 'Bandipur is a national treasure. We must protect it at all costs. Reported to forest department.', authorName: 'Ravi Shankar', authorAvatar: DEMO_AVATARS('Ravi'), timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
    ],
    '4': [
        { id: 'dc4a', text: 'Organized a cleanup drive last weekend. Collected over 200kg of plastic! We need regular drives.', authorName: 'Sneha Iyer', authorAvatar: DEMO_AVATARS('Sneha'), timestamp: new Date(Date.now() - 7 * 3600000).toISOString() },
        { id: 'dc4b', text: 'BMC should install more dustbins along the beach. This is a civic responsibility too.', authorName: 'Farhan Sheikh', authorAvatar: DEMO_AVATARS('Farhan'), timestamp: new Date(Date.now() - 6.5 * 3600000).toISOString() },
    ],
    '5': [
        { id: 'dc5a', text: 'Industrial waste is a serious concern. CPCB guidelines are clearly being violated here.', authorName: 'Deepa Nair', authorAvatar: DEMO_AVATARS('Deepa'), timestamp: new Date(Date.now() - 10 * 3600000).toISOString() },
    ],
    '6': [
        { id: 'dc6a', text: 'Great initiative! We planted 50 trees in our colony last month. Every tree counts! 🌱', authorName: 'Kiran Joshi', authorAvatar: DEMO_AVATARS('Kiran'), timestamp: new Date(Date.now() - 14 * 3600000).toISOString() },
        { id: 'dc6b', text: 'BSF jawans and villagers working together for afforestation. This gives me hope! 🙏', authorName: 'Amit Tiwari', authorAvatar: DEMO_AVATARS('Amit'), timestamp: new Date(Date.now() - 13 * 3600000).toISOString() },
    ],
};

/**
 * Seed demo comments into localStorage for all mock posts.
 */
export function seedDemoComments() {
    Object.entries(demoComments).forEach(([postId, comments]) => {
        const key = `ecoalert_comments_${postId}`;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(comments));
        }
    });
}
