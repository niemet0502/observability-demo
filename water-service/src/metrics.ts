import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { resourceFromAttributes } from "@opentelemetry/resources";
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

// Define resource with service name
const resource = resourceFromAttributes({
    "service.name": 'water-service',
});

// ✅ Use the OTLP Exporter to send metrics to OpenTelemetry Collector
const metricsExporter = new OTLPMetricExporter({
    url: 'http://otel-collector:4318/v1/metrics', // Make sure this matches your OTEL Collector
});

// ✅ Attach the OTLP exporter to the Periodic Metric Reader
export const metricReader = new PeriodicExportingMetricReader({
    exporter: metricsExporter, // ✅ Correctly using OTLP exporter
    exportIntervalMillis: 5000, // ✅ Export every 5s
});

// ✅ Pass the resource and attach the metric reader
const meterProvider = new MeterProvider({
    resource,  // ✅ Add service name
    readers: [metricReader],
});

// Get the meter from the meter provider
const meter = meterProvider.getMeter('water-service');

// Define a Counter for tracking total API requests
export const requestCounter = meter.createCounter('http_requests_total', {
    description: 'Total number of HTTP requests',
});

// Define a Histogram for measuring request durations
export const requestDuration = meter.createHistogram('http_request_duration_seconds', {
    description: 'Time taken to process requests',
});

 const successRequestCounter = meter.createHistogram('SUCCESS', {
    description: 'Total number of success',
});

 const errorRequestCounter = meter.createHistogram('ERROR', {
    description: 'Total number of error',
});

const requestApiCounter = meter.createCounter('http_requests_api', {
    description: 'Total number of HTTP requests',
});
const successfulRequestsGauge = meter.createUpDownCounter('http_requests_success_current', {
    description: 'Current number of successful coffee requests',
});

const failedRequestsGauge = meter.createUpDownCounter('http_requests_failed_current', {
    description: 'Current number of failed coffee requests',
});


// Example function to track a request
export function trackRequest(route: string, duration: number) {
    requestCounter.add(1, { route }); // ✅ Increment request count
    requestDuration.record(duration, { route }); // ✅ Record request duration
}

// ✅ Register the meterProvider globally
meterProvider.forceFlush().then(() => console.log("Metrics setup complete"));

// Export meterProvider

export { errorRequestCounter, failedRequestsGauge, requestApiCounter, successfulRequestsGauge, successRequestCounter };

