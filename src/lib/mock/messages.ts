import type { Message, MessageThread } from "./types";

const minus = (mins: number) =>
  new Date(Date.now() - mins * 60000).toISOString();

const ashaMessages: Message[] = [
  {
    id: "msg-asha-1",
    threadId: "thread-asha",
    fromRole: "dietitian",
    fromName: "Maya Singh",
    body: "Hi Asha — your dinners are spiking glucose. Want to try a smaller rice portion with extra dhal this week?",
    sentAt: minus(60 * 24 * 2),
    read: true,
  },
  {
    id: "msg-asha-2",
    threadId: "thread-asha",
    fromRole: "patient",
    fromName: "Asha",
    body: "Yes I'll try it tomorrow. Could I add a roti instead?",
    sentAt: minus(60 * 23),
    read: true,
  },
  {
    id: "msg-asha-3",
    threadId: "thread-asha",
    fromRole: "dietitian",
    fromName: "Maya Singh",
    body: "Yes, one wholewheat roti instead of half the rice would be great. Looking forward to seeing the CGM tomorrow night.",
    sentAt: minus(60 * 22),
    read: false,
  },
];

const linaMessages: Message[] = [
  {
    id: "msg-lina-1",
    threadId: "thread-lina",
    fromRole: "patient",
    fromName: "Lina",
    body: "I had really bad nausea after the medication this morning. Should I skip dose tonight?",
    sentAt: minus(60 * 4),
    read: false,
  },
];

const omarMessages: Message[] = [
  {
    id: "msg-omar-1",
    threadId: "thread-omar",
    fromRole: "dietitian",
    fromName: "Maya Singh",
    body: "Your BP trend is improving on the new plan — 6/7 days within target. Keep it up!",
    sentAt: minus(60 * 30),
    read: true,
  },
];

export const THREADS: MessageThread[] = [
  {
    id: "thread-asha",
    patientId: "asha",
    dietitianId: "maya",
    dietitianName: "Maya Singh",
    messages: ashaMessages,
  },
  {
    id: "thread-lina",
    patientId: "lina",
    dietitianId: "sarah",
    dietitianName: "Sarah Liu",
    messages: linaMessages,
  },
  {
    id: "thread-omar",
    patientId: "omar",
    dietitianId: "maya",
    dietitianName: "Maya Singh",
    messages: omarMessages,
  },
];

export function threadForPatient(patientId: string): MessageThread | undefined {
  return THREADS.find((t) => t.patientId === patientId);
}

export function unreadDietitianInbox(dietitianId: string): MessageThread[] {
  return THREADS.filter(
    (t) => t.dietitianId === dietitianId && t.messages.some((m) => !m.read),
  );
}
