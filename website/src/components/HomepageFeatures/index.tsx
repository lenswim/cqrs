import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Browse Conversations',
    Svg: require('@site/static/img/browse.svg').default,
    description: (
      <>
        Browse through all quotes and conversations collected throughout the years.
      </>
    ),
  },
  {
    title: 'Save New Conversations',
    Svg: require('@site/static/img/save.svg').default,
    description: (
      <>
        Save new quotes and conversations so everyone can enjoy them.
      </>
    ),
  },
  {
    title: 'Statistics',
    Svg: require('@site/static/img/statistics.svg').default,
    description: (
      <>
        Take a look at the statistics and see who has the most punchlines and more.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
