import {
  Reference,
  ReferenceMap,
  Optionalize,
  AsyncIteratorConfig,
  AsyncIteratorFn,
  AsyncIterator,
  AsyncIteratorPushFn,
  AsyncIteratorDoneFn
} from './types';
import seedChannels from './utils/seedChannels';
import createModuloIncrementor from './utils/createModuloIncrementor';


/**
 * Creates an asynchronous iterator.
 * @param fn The iterator handler function, invoked for each iteration.
 * @param config Configuration settings for the iterator. 
 */
export const asyncIterator = <
  /** The return type of the handler function, sans promise. */
  T = any,
  /** The push value that is passed in to subsequent handler invocations */
  P = any,
  /** The arguments passed into the .next function of the iterator. */
  Args extends any[] = any[]
>(
  fn: AsyncIteratorFn<T, P, Args>,
  {concurrency = 1}: AsyncIteratorConfig = {} as AsyncIteratorConfig
): AsyncIterator<T, Args> => {
  const channels: Optionalize<Reference<T>, 'promise'>[] = seedChannels(concurrency);
  const moduloIncrementor = createModuloIncrementor(concurrency);
  
  return {
    next: (...args) => {
      const channel = moduloIncrementor();

      const reference: ReferenceMap<T> = {
        existing: channels[channel] as Reference<T>,
        new: {done: false},
      };
      channels[channel] = reference.new;

      let pushCalled = false;
      const push: AsyncIteratorPushFn<P> = (value) => {
        if (pushCalled) throw new Error('Cannot call push more than once per iteration.');
        pushCalled = true;
        reference.new.pushed = value;
      };

      const done: AsyncIteratorDoneFn = () => reference.new.done = true;

      reference.new.promise = reference.existing.promise
      .then(
        result => fn(reference.existing.pushed, {args, channel, push, done, result}),
        error => fn(reference.existing.pushed, {args, channel, push, done, error})
      );

      return reference.new.promise
      .then(
        value => ({value, done: !!reference.new.done}),
        error => ({error, done: !!reference.new.done})
      );
    }
  }
};
