export type AnalyticsEventName =
  | 'phone_click'
  | 'whatsapp_click'
  | 'maps_click'
  | 'request_service_click'
  | 'service_form_start'
  | 'service_form_submit';

export type AnalyticsEventData = {
  service_name?: string;
  service_category?: string;
  source_page?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: 'event', eventName: string, parameters?: Record<string, unknown>) => void;
  }
}

export function trackEvent(eventName: AnalyticsEventName, data: AnalyticsEventData = {}) {
  if (typeof window === 'undefined') return;

  const detail = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

  window.dispatchEvent(new CustomEvent('ov:analytics', { detail: { event: eventName, ...detail } }));

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...detail });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, detail);
  }
}

const conversionEvents: Record<string, AnalyticsEventName> = {
  'phone-click': 'phone_click',
  'whatsapp-click': 'whatsapp_click',
  'location-click': 'maps_click',
  'maps-click': 'maps_click',
  'request-service-click': 'request_service_click',
};

export function installConversionTracking() {
  const handleClick = (event: MouseEvent) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-conversion]')
      : null;
    if (!target) return;

    const eventName = conversionEvents[target.dataset.conversion ?? ''];
    if (!eventName) return;

    trackEvent(eventName, {
      service_name: target.dataset.serviceName,
      service_category: target.dataset.serviceCategory,
      source_page: target.dataset.sourcePage ?? window.location.pathname,
    });
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}