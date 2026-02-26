// AI Suggestion Engine — maps category + risk to actionable recommendations

const SUGGESTIONS = {
    Air: {
        Critical: [
            '🚨 Evacuate the area immediately if breathing is difficult',
            '😷 Wear N95 masks before venturing outdoors',
            '📞 Call the Pollution Control Board helpline: 1800-11-4000',
            '🚫 Avoid opening windows, seal door gaps with wet cloth',
            '🏥 Seek immediate medical help if experiencing chest pain or shortness of breath',
        ],
        High: [
            '😷 Wear a mask (N95 or better) when outside',
            '📴 Reduce outdoor activities, especially exercise',
            '🌿 Use air purifiers indoors if available',
            '📢 Report to your local Municipal Corporation pollution cell',
            '🌱 Plant air-purifying trees like Tulsi, Neem around homes',
        ],
        Medium: [
            '🖼️ Document the smoke or haze with time-stamped photos',
            '📝 File a complaint at the State Pollution Control Board portal',
            '💨 Use exhaust fans in kitchens, avoid burning waste',
            '🌳 Support local tree plantation drives',
        ],
        Low: [
            '♻️ Reduce personal carbon footprint: use public transport',
            '🌿 Plant trees and encourage neighbors to do the same',
            '🔕 Avoid burning leaves or garbage',
        ],
    },
    Water: {
        Critical: [
            '🚱 Do NOT drink tap or river water until authorities confirm safety',
            '🧴 Use only sealed bottled water for cooking and drinking',
            '📞 Alert local water authority immediately',
            '🏥 Watch for symptoms: vomiting, diarrhea, skin rash — seek medical help',
            '🆘 Report to National Disaster Management helpline: 1078',
        ],
        High: [
            '🚱 Boil water before drinking or use a UV purifier',
            '📸 Report illegal discharge to the State Pollution Control Board',
            '🐟 Avoid consuming fish from affected water bodies',
            '📢 Warn neighbors and nearby communities immediately',
            '🧪 Request water quality testing from local authorities',
        ],
        Medium: [
            '🗑️ Avoid dumping garbage or sewage near water bodies',
            '📋 Document water discoloration with photos and GPS coordinates',
            '📣 Raise awareness in your community about water conservation',
            '🌿 Participate in local river clean-up drives',
        ],
        Low: [
            '💧 Conserve water: fix leaks, use buckets instead of hoses',
            '♻️ Avoid single-use plastic near water bodies',
            '🌱 Plant vegetation along riverbanks to prevent erosion',
        ],
    },
    Land: {
        Critical: [
            '⛔ Stay away from the affected area — risk of collapse or toxic exposure',
            '📞 Alert local disaster management authority immediately',
            '🆘 National Disaster Response Force (NDRF): 1078',
            '🏃 Follow evacuation orders from local authorities',
            '📸 Document with photos for official records',
        ],
        High: [
            '🚧 Erect barriers around affected land to prevent accidents',
            '📢 Report illegal dumping to your local municipality',
            '🧹 Organize community clean-up with proper protective gear',
            '🌱 Support reforestation programs to restore degraded land',
        ],
        Medium: [
            '♻️ Participate in local waste segregation programs',
            '📋 Report illegal construction or deforestation to local authorities',
            '🌿 Support organic farming initiatives in your community',
            '🗑️ Ensure proper disposal of construction debris',
        ],
        Low: [
            '🌱 Plant trees and maintain green spaces in your area',
            '♻️ Practice composting to reduce organic waste',
            '🧹 Join or organize local area clean-up events',
        ],
    },
    Wildlife: {
        Critical: [
            '🐾 Do not approach injured or sick wild animals',
            '📞 Call Wildlife SOS helpline: 1800-11-9991',
            '🚫 Do not attempt to relocate animals on your own',
            '📸 Document and report to the Forest Department immediately',
            '🔒 Keep children and pets indoors',
        ],
        High: [
            '📢 Report poaching or illegal trapping to the Forest Department',
            '🌿 Avoid disturbing natural habitats during sensitive seasons',
            '📸 Document and share with wildlife conservation NGOs',
            '🐛 Support biodiversity by maintaining native plant gardens',
        ],
        Medium: [
            '🌿 Create wildlife-friendly gardens with native plants',
            '📴 Reduce artificial lighting near forests and water bodies',
            '🐟 Follow sustainable fishing practices',
            '♻️ Reduce plastic use to protect marine wildlife',
        ],
        Low: [
            '🐦 Install bird feeders and nest boxes in your area',
            '🌿 Avoid pesticides harmful to pollinators (bees, butterflies)',
            '♻️ Reduce, Reuse, Recycle to minimize habitat disruption',
        ],
    },
    Climate: {
        Critical: [
            '🌡️ Follow heat action plan if temperatures exceed 45°C',
            '💧 Stay hydrated — drink at least 3L of water daily',
            '🏠 Seek shelter in cool, shaded areas during peak hours (11am–3pm)',
            '🆘 Check on elderly and vulnerable neighbors',
            '📞 Report extreme weather events to IMD: 1800-180-1717',
        ],
        High: [
            '☀️ Reduce carbon footprint: switch to renewable energy',
            '🌱 Support tree plantation at a large scale',
            '🚗 Shift to electric vehicles or use public transport',
            '📊 Monitor local weather alerts via IMD app',
        ],
        Medium: [
            '💡 Switch to LED bulbs and energy-efficient appliances',
            '🌿 Support local climate action groups and NGOs',
            '♻️ Practice zero-waste lifestyle',
            '📚 Educate community about climate change impacts',
        ],
        Low: [
            '🌱 Plant one tree every month',
            '💧 Harvest rainwater for garden use',
            '🚲 Use cycling or walking for short distances',
        ],
    },
    Disaster: {
        Critical: [
            '🆘 Call emergency services immediately: 112',
            '🏃 Evacuate to designated safety zones',
            '📻 Follow official instructions from local authorities',
            '🚿 Do not use electrical appliances if flooding is possible',
            '📦 Keep emergency kit ready: water, food, medicines, documents',
        ],
        High: [
            '📦 Prepare an emergency go-bag with essentials',
            '📞 Register for local disaster alert notifications',
            '🏠 Reinforce your home against flooding or high winds',
            '🤝 Check on vulnerable neighbors and assist if possible',
        ],
        Medium: [
            '📋 Create a family emergency plan and practice drills',
            '💧 Store at least 3-day supply of clean water',
            '📱 Download NDMA Sachet and Disaster Management apps',
            '🌿 Participate in community resilience programs',
        ],
        Low: [
            '🌱 Clear drains and gutters in your area before monsoon',
            '📚 Learn basic first aid and CPR',
            '🤝 Join local civil defence volunteer groups',
        ],
    },
};

export function getSuggestions(category = 'Climate', riskLevel = 'Medium') {
    const categoryMap = SUGGESTIONS[category] || SUGGESTIONS['Climate'];
    const suggestions = categoryMap[riskLevel] || categoryMap['Medium'];
    return suggestions;
}

export function getGeneralTips() {
    return [
        '📸 Always document issues with photos before reporting',
        '📍 Include exact location and time when filing complaints',
        '📢 Share verified information to raise community awareness',
        '🤝 Connect with local environmental NGOs for organized action',
        '📱 Use government apps like CPCB Air, Jal Jeevan Mission for latest data',
    ];
}
