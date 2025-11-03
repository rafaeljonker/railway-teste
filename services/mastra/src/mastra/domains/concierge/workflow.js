/**
 * Concierge Main Workflow
 * Orchestrates the entire conversation flow from WhatsApp webhook to response
 */
import { RuntimeContext } from "@mastra/core/runtime-context";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { getOrCreateUser } from "../user-management";
import { extractMessageText, extractPhoneNumber, sendWhatsAppMessage, } from "../whatsapp";
const processUserMessage = createStep({
    id: "process-user-message",
    description: "Process user message through concierge agent",
    inputSchema: z.object({
        userId: z.string(),
        message: z.string(),
    }),
    outputSchema: z.object({
        response: z.string(),
    }),
    execute: async ({ inputData, mastra }) => {
        const { userId, message } = inputData;
        try {
            // Get concierge agent
            const agent = mastra?.getAgent("conciergeAgent");
            if (!agent) {
                throw new Error("Concierge agent not found");
            }
            console.log(`🤖 Processing message for user ${userId}: "${message}"`);
            // Generate response using agent
            const runtimeContext = new RuntimeContext();
            runtimeContext.set("userId", userId);
            console.log(`📡 Calling agent.generateLegacy()...`);
            const response = await agent.generateLegacy([
                {
                    role: "user",
                    content: message,
                },
            ], {
                runtimeContext,
            });
            console.log(`💬 Generated response (${response.text.length} chars)`);
            console.log(`📄 Response preview: ${response.text.substring(0, 200)}...`);
            return {
                response: response.text,
            };
        }
        catch (error) {
            console.error("❌ ERROR in processUserMessage step:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            throw error;
        }
    },
});
const breakIntoMessages = createStep({
    id: "break-into-messages",
    description: "Break long response into WhatsApp-friendly messages",
    inputSchema: z.object({
        response: z.string(),
    }),
    outputSchema: z.object({
        messages: z.array(z.string()),
    }),
    execute: async ({ inputData }) => {
        const { response } = inputData;
        try {
            console.log(`✂️  Breaking response into WhatsApp messages...`);
            // Simple splitting by paragraphs
            const messages = response
                .split("\n\n")
                .filter((msg) => msg.trim().length > 0)
                .slice(0, 8); // Max 8 messages
            console.log(`📝 Created ${messages.length} messages`);
            return { messages };
        }
        catch (error) {
            console.error("❌ ERROR in breakIntoMessages step:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            throw error;
        }
    },
});
const sendMessages = createStep({
    id: "send-messages",
    description: "Send messages to user via WhatsApp",
    inputSchema: z.object({
        messages: z.array(z.string()),
        userPhone: z.string(),
    }),
    outputSchema: z.object({
        sentCount: z.number(),
    }),
    execute: async ({ inputData }) => {
        const { messages, userPhone } = inputData;
        try {
            console.log(`\n🔥 Sending ${messages.length} messages to ${userPhone}...`);
            let sentCount = 0;
            // Send each message with delay for natural flow
            for (let i = 0; i < messages.length; i++) {
                console.log(`📤 Sending message ${i + 1}/${messages.length}...`);
                const success = await sendWhatsAppMessage({
                    to: userPhone,
                    message: messages[i],
                });
                if (success) {
                    sentCount++;
                    console.log(`✅ Message ${i + 1} sent successfully`);
                }
                else {
                    console.error(`❌ Failed to send message ${i + 1}`);
                }
                // Delay between messages (natural texting rhythm)
                if (i < messages.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
            console.log(`\n✅ Successfully sent ${sentCount}/${messages.length} messages\n`);
            return { sentCount };
        }
        catch (error) {
            console.error("❌ ERROR in sendMessages step:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            throw error;
        }
    },
});
export const conciergeMainWorkflow = createWorkflow({
    id: "concierge-main-workflow",
    inputSchema: z.object({
        webhookPayload: z.string(),
    }),
    outputSchema: z.object({
        sentCount: z.number(),
    }),
})
    // Step 1: Extract and prepare user data
    .map(async ({ inputData }) => {
    const webhookData = JSON.parse(inputData.webhookPayload);
    // Extract phone and message
    const userPhone = extractPhoneNumber(webhookData);
    const messageText = extractMessageText(webhookData);
    if (!userPhone || !messageText) {
        throw new Error("Invalid webhook payload: missing phone or message");
    }
    console.log(`📨 Message from ${userPhone}: "${messageText}"`);
    // Get or create user profile
    const user = await getOrCreateUser(userPhone);
    console.log(`👤 User: ${user.name || "unnamed"} (${user.subscription.tier})`);
    return {
        userId: userPhone,
        message: messageText,
    };
})
    // Step 2: Process message through agent
    .then(processUserMessage)
    // Step 3: Break into WhatsApp messages
    .then(breakIntoMessages)
    // Step 4: Prepare for sending
    .map(async ({ inputData, getInitData }) => {
    const initData = getInitData();
    const webhookData = JSON.parse(initData.webhookPayload);
    const userPhone = extractPhoneNumber(webhookData);
    if (!userPhone) {
        throw new Error("Cannot extract phone number");
    }
    return {
        messages: inputData.messages,
        userPhone,
    };
})
    // Step 5: Send messages
    .then(sendMessages);
conciergeMainWorkflow.commit();
