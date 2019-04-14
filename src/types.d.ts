/** Iterator object capable of repeated invocations until "done" */
export type AsyncIterator<T, Args extends any[] = any[]> = {
  next: (...args: Args) => Promise<AsyncIteratorOutput<T | undefined>>
};

/** The iterator output. */
export type AsyncIteratorOutput<T> = {
  done: boolean,
  value?: T,
  error?: Error
};

/** Configuration settings for the iterator. */
export type AsyncIteratorConfig = {
  /** How many channels to create in the iterator capable of executing simultaneously. */
  concurrency: number,
};

/** The iterator handler function, invoked for each iteration. */
export type AsyncIteratorFn<
  /** The handler output. */
  T,
  /** The type that can be pushed in from a previous iteration. */
  P,
  /** The arguments that were used to invoke the "next" function on the iterator for this iteration. */
  Args
> = (
  /** The type that can be pushed in from a previous iteration. */
  pushed: P,
  /** The meta information for this iteration, including .push and .done behaviors. */
  meta: AsyncIteratorMeta<Args, P, T>
) => Promise<T | undefined>;

/** The meta information for this iteration, including .push and .done behaviors. */
export type AsyncIteratorMeta<Args, P, T>  = {
  /** The arguments that were used to invoke the "next" function on the iterator for this iteration. */
  args: Args,
  /** The concurrency channel of this invocation. */
  channel: number,
  /** Function used to push a value into the next iteration. */
  push: AsyncIteratorPushFn<P>,
  /** Function used to indicate that iteration of this channel has completed. */
  done: AsyncIteratorDoneFn,
  /** The handler result. */
  result?: T,
  /** Erro encountered. */
  error?: Error,
};

/** Function used to push a value into the next iteration. */
export type AsyncIteratorPushFn<P> = (value: P) => void;

/** Functino used to indicate that iteration of this channel has completed. */
export type AsyncIteratorDoneFn = () => void;

/** Reference object for a current iteration. */
export type Reference<T> = {
  /** The promise representing this iteration's completion state. */
  promise: Promise<T | undefined>,
  /** A value that was pushed from the previous iteration. */
  pushed?: any,
  /** Whether or not this iteration is the final iteration for the concurrency channel. */
  done?: boolean,
};

/** A map of the current and previous iteration's references for this concurrency channel. */
export type ReferenceMap<T> = {
  /** The previous iteration's reference. */
  existing: Reference<T>,
  /** The current iteration's reference. */
  new: Optionalize<Reference<T>, 'promise'>,
};

/** Omit the keys in k from type T */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** Make selected object keys defined by K optional in type T */
export type Optionalize<T, K extends keyof T> = Omit<T, K> & Partial<T>;
