import * as React from 'react';

import AggregationComponent, {AggregationComponentProps} from "../AggregationComponent";

class TermsAggregation extends AggregationComponent<AggregationComponentProps> {

    renderAggregation(aggregation) {
        return (
            <div>
                {this.props.name} aggregation values
                {
                    this.renderBuckets(aggregation, function (bucket) {
                        return (
                            <div key={bucket.key}>
                                {bucket.key} ({bucket.doc_count})
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    renderBuckets(aggregation, renderBucket, index = 0) {
        return aggregation.buckets.map(bucket => {
            return (
                <div key={bucket.key}>
                    {renderBucket(bucket)}
                    {
                        this.getSubAggregations(bucket).map(subAggregationKey => {
                            var subAggregation = bucket[subAggregationKey];
                            return this.renderBuckets(subAggregation, renderBucket, index + 1);
                        })
                    }
                </div>
            )
        });
    }

    getSubAggregations(aggregation) {
        return Object.keys(aggregation).filter(key =>
            key !== 'key' &&
            key !== 'doc_count' &&
            key !== 'doc_count_error_upper_bound' &&
            key !== 'sum_other_doc_count'
        );
    }

    getAggregation() {
        return {
            terms: {
                field: this.props.name + '.keyword'
            }
        };
    }

}

export default TermsAggregation;
