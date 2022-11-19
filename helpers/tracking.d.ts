declare class Tracking {
    /**
     * Increment: Increments a stat by a value (default is 1)
     *   tracking.increment('my_counter');
     *
     * Incrementing multiple items
     *   tracking.increment(['these', 'are', 'different', 'stats']);
     *
     * Sampling, this will sample 25% of the time the StatsD Daemon will compensate for sampling
     *   tracking.increment('my_counter', 1, 0.25);
     */
    increment(stat: any, ...args: any[]): Promise<any>;
    /**
     * Decrement: Decrements a stat by a value (default is -1)
     *   tracking.decrement('my_counter');
     */
    decrement(stat: any, ...args: any[]): Promise<any>;
    /**
     * Gauge: Gauge a stat by a specified amount
     *   tracking.gauge('my_gauge', 123.45);
     */
    gauge(stat: any, ...args: any[]): Promise<any>;
    /**
     * Timing: sends a timing command with the specified milliseconds
     *   tracking.timing('response_time', 42);
     */
    timing(stat: any, ...args: any[]): Promise<any>;
    /**
     * Histogram: send data for histogram stat
     *   tracking.histogram('my_histogram', 42);
     *
     * Tags, this will add user-defined tags to the data
     *   tracking.histogram('my_histogram', 42, ['foo', 'bar']);
     *
     * Sampling, tags and callback are optional and could be used in any combination
     *   tracking.histogram('my_histogram', 42, 0.25); // 25% Sample Rate
     *   tracking.histogram('my_histogram', 42, ['tag']); // User-defined tag
     *   tracking.histogram('my_histogram', 42, next); // Callback
     *   tracking.histogram('my_histogram', 42, 0.25, ['tag']);
     *   tracking.histogram('my_histogram', 42, 0.25, next);
     *   tracking.histogram('my_histogram', 42, ['tag'], next);
     *   tracking.histogram('my_histogram', 42, 0.25, ['tag'], next);
     *
     */
    histogram(stat: any, ...args: any[]): Promise<any>;
    /**
     * Set: Counts unique occurrences of a stat (alias of unique)
     *   tracking.unique('my_unique', 'foobarbaz');
     *   tracking.set('my_unique', 'foobar');
     *   tracking.set(['foo', 'bar'], 42, function(error, bytes){
     *     // this only gets called once after all messages have been sent
     *     if (error) {
     *       console.error('Oh noes! There was an error:', error);
     *     } else {
     *       console.log('Successfully sent', bytes, 'bytes');
     *     }
     *   });
     */
    set(stat: any, ...args: any[]): Promise<any>;
    unique(stat: any, ...args: any[]): Promise<any>;
    /**
     * Events represent how users interact with your application. For example, "Button Clicked" may be an action you want to note.
     *   tracking.track('Button Clicked', eventProperties, {
     *     user_id: 'user@neta.mx',
     *   });
     */
    private dispatchEvent;
}
export declare const tracking: Tracking;
export {};
