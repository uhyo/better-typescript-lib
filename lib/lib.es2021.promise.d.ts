/// <reference no-default-lib="true"/>

interface AggregateError extends Error {
  errors: unknown[];
}

declare var AggregateError: AggregateErrorConstructor;
