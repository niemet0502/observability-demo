import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MySQLInstrumentation } from '@opentelemetry/instrumentation-mysql';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import * as process from 'process';

// const traceExporter = new ConsoleSpanExporter();

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4317/v1/traces', // Adjust based on your Tempo setup
});

export const otelSDK = new NodeSDK({
  resource: new Resource({
    "service.name": `water-service`, // update this to a more relevant name for you!
  }),
  traceExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
    new MySQLInstrumentation(), 
    new TypeormInstrumentation(
      {
        responseHook: (span, response) => {
          span.setAttribute('db.response', JSON.stringify(response)); // Capture response (optional)
        },
        moduleVersionAttributeName: 'typeorm.version', // Track TypeORM version
      }
    )
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
