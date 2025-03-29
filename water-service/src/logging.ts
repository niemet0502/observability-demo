import { Logger } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

const resource = resourceFromAttributes({
  "service.name": 'water-service',
});

// Create a Logger Provider
const loggerProvider = new LoggerProvider(
  {resource}
);

// Export logs to OpenTelemetry Collector
const logExporter = new OTLPLogExporter({
  url: 'http://otel-collector:4318/v1/logs', // OTLP HTTP endpoint of OTel Collector
});

// Register exporter
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));

// Create a logger
const logger: Logger = loggerProvider.getLogger("water-service");

logger.emit({
  severityText: "INFO",
  body: "water-type service started successfully!",
});

export { logger };
