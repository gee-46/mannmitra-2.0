import { ChatMessage } from '../types';

// Crisis keywords for immediate support
const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'want to die', 'hurt myself',
    'self harm', 'hopeless', 'no point', 'better off dead', 'end my life'
];

// Intent patterns for feature navigation
const intentPatterns = {
    moodTracking: ['mood', 'feeling', 'emotion', 'track', 'log mood', 'how am i'],
    breathing: ['breathe', 'breathing', 'calm down', 'anxiety', 'panic', 'relax'],
    meditation: ['meditate', 'meditation', 'mindful', 'peace', 'zen'],
    journal: ['journal', 'write', 'thoughts', 'diary', 'note'],
    media: ['music', 'video', 'podcast', 'listen', 'watch'],
    sleep: ['sleep', 'insomnia', 'tired', 'rest', 'cant sleep'],
    stress: ['stress', 'stressed', 'overwhelmed', 'pressure', 'burden'],
    gratitude: ['grateful', 'gratitude', 'thankful', 'appreciate'],
    help: ['help', 'support', 'talk', 'need someone']
};

// Mental health support responses
const supportResponses = {
    anxiety: [
        "I hear you. Anxiety can feel overwhelming. Would you like to try a breathing exercise? It can help calm your nervous system.",
        "It's okay to feel anxious. Let's take this one step at a time. Have you tried our breathing exercises?",
    ],
    stress: [
        "Stress can be really challenging. Remember, it's okay to take breaks. Would you like to try some relaxation techniques?",
        "I understand you're feeling stressed. Let's work on this together. How about we start with a quick breathing exercise?",
    ],
    sadness: [
        "I'm sorry you're feeling this way. Your feelings are valid. Sometimes journaling can help process these emotions. Would you like to try?",
        "It's okay to feel sad. Would you like to talk more about what's on your mind, or would you prefer to try a calming activity?",
    ],
    sleep: [
        "Sleep issues can be tough. Have you tried our Sleep & Relaxation podcast? It's designed to help you wind down.",
        "Getting good sleep is important. Let me guide you to some resources that might help.",
    ],
    general: [
        "I'm here to listen. Could you tell me more about what's on your mind?",
        "Thank you for sharing. How are you feeling right now?",
        "I understand. What would be most helpful for you right now?",
    ]
};

// Feature navigation responses
const navigationResponses = {
    moodTracking: {
        text: "I can help you track your mood! Logging your emotions regularly can help you understand patterns and triggers.",
        action: { type: 'navigate' as const, path: '/mood-tracker', label: 'Go to Mood Tracker' }
    },
    breathing: {
        text: "Let's try a breathing exercise together. It can help calm your mind and reduce anxiety.",
        action: { type: 'navigate' as const, path: '/breathing', label: 'Start Breathing Exercise' }
    },
    meditation: {
        text: "Meditation can be very helpful. I can guide you to our mindfulness tools.",
        action: { type: 'navigate' as const, path: '/mindfulness', label: 'Explore Mindfulness Tools' }
    },
    journal: {
        text: "Journaling is a great way to process your thoughts and feelings. Would you like to start writing?",
        action: { type: 'navigate' as const, path: '/journal', label: 'Open Journal' }
    },
    media: {
        text: "I have some calming videos and mindful podcasts that might help. Let me show you.",
        action: { type: 'navigate' as const, path: '/media', label: 'Browse Media' }
    }
};

// Detect crisis situation
export const detectCrisis = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Detect user intent
export const detectIntent = (message: string): string | null => {
    const lowerMessage = message.toLowerCase();

    for (const [intent, keywords] of Object.entries(intentPatterns)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return intent;
        }
    }

    return null;
};

// Get random response from array
const getRandomResponse = (responses: string[]): string => {
    return responses[Math.floor(Math.random() * responses.length)];
};

// Generate AI response
export const generateChatbotResponse = async (
    message: string,
    _context?: string
): Promise<Omit<ChatMessage, 'id'>> => {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerMessage = message.toLowerCase();

    // Check for crisis first
    if (detectCrisis(message)) {
        return { sender: 'ai', isCrisisCard: true, text: '' };
    }

    // Detect intent
    const intent = detectIntent(message);

    // Handle navigation intents
    if (intent && navigationResponses[intent as keyof typeof navigationResponses]) {
        const response = navigationResponses[intent as keyof typeof navigationResponses];
        return {
            sender: 'ai',
            text: response.text,
            action: response.action
        };
    }

    // Handle mental health support
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('panic')) {
        return { sender: 'ai', text: getRandomResponse(supportResponses.anxiety) };
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
        return { sender: 'ai', text: getRandomResponse(supportResponses.stress) };
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
        return { sender: 'ai', text: getRandomResponse(supportResponses.sadness) };
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
        return { sender: 'ai', text: getRandomResponse(supportResponses.sleep) };
    }

    // Greeting responses
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good evening)/)) {
        return {
            sender: 'ai',
            text: "Hello! I'm here to support you. How are you feeling today?"
        };
    }

    // Gratitude responses
    if (lowerMessage.includes('thank')) {
        return {
            sender: 'ai',
            text: "You're welcome! I'm here whenever you need support. How else can I help you today?"
        };
    }

    // Default empathetic response
    return { sender: 'ai', text: getRandomResponse(supportResponses.general) };
};
