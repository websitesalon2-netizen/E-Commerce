import { Order } from '../types';
import { formatINR } from './currency';

export const DEFAULT_SHOP_WHATSAPP = '919622229622';
export const DEVELOPER_WHATSAPP_NUMBER = '919622229622';
export const DEVELOPER_WHATSAPP_DISPLAY = '+91 96222 29622';
export const DEVELOPER_PREFILLED_MESSAGE = 'Hello, i want to Discuss about Website for my Business';

/**
 * Normalizes phone number to international WhatsApp format (digits only)
 */
export function sanitizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits || DEFAULT_SHOP_WHATSAPP;
}

/**
 * Builds the official WhatsApp Order confirmation message for Pioneer Clothing House
 */
export function buildOrderWhatsAppMessage(order: Order): string {
  const lines: string[] = [
    '*Pioneer Clothing House — New Order*',
    '--------------------------------',
    `*Order ID:* ${order.orderNumber}`,
    `*Customer Name:* ${order.customerName}`,
    `*Mobile Number:* ${order.mobile}`,
  ];

  if (order.whatsapp && order.whatsapp !== order.mobile) {
    lines.push(`*WhatsApp:* ${order.whatsapp}`);
  }

  lines.push(
    `*Delivery Address:* ${order.address}`,
    `*City:* ${order.city || 'Shalina'}`,
    `*PIN Code:* ${order.pinCode}`
  );

  if (order.landmark) {
    lines.push(`*Landmark:* ${order.landmark}`);
  }

  lines.push(
    '--------------------------------',
    '*Products Ordered:*'
  );

  order.items.forEach((item, index) => {
    let itemLine = `${index + 1}. *${item.productName}*`;
    const specs: string[] = [];
    if (item.selectedSize) specs.push(`Size: ${item.selectedSize}`);
    if (item.selectedColor) specs.push(`Color: ${item.selectedColor}`);
    if (specs.length > 0) {
      itemLine += ` (${specs.join(', ')})`;
    }
    itemLine += `\n   Qty: ${item.quantity} × ${formatINR(item.unitPrice)} = ${formatINR(item.productTotal)}`;
    lines.push(itemLine);
  });

  lines.push(
    '--------------------------------',
    `*Subtotal:* ${formatINR(order.subtotal)}`,
    `*Delivery Charge:* ${order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}`,
    `*Grand Total:* ${formatINR(order.grandTotal)}`,
    '--------------------------------',
    `*Payment Method:* ${order.paymentMethod}`,
    `*Payment Status:* ${order.paymentStatus}`
  );

  if (order.notes && order.notes.trim()) {
    lines.push(`*Customer Notes:* ${order.notes.trim()}`);
  }

  if (order.deliveryInstructions && order.deliveryInstructions.trim()) {
    lines.push(`*Delivery Instructions:* ${order.deliveryInstructions.trim()}`);
  }

  lines.push(
    '--------------------------------',
    'Thank you for ordering with Pioneer Clothing House!'
  );

  return lines.join('\n');
}

/**
 * Creates a direct WhatsApp wa.me URL
 */
export function getOrderWhatsAppUrl(order: Order, recipientPhone?: string): string {
  const phone = sanitizeWhatsAppNumber(recipientPhone || DEFAULT_SHOP_WHATSAPP);
  const text = buildOrderWhatsAppMessage(order);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Creates Developer credit WhatsApp URL
 */
export function getDeveloperWhatsAppUrl(): string {
  return `https://wa.me/${DEVELOPER_WHATSAPP_NUMBER}?text=${encodeURIComponent(DEVELOPER_PREFILLED_MESSAGE)}`;
}
