import Card from '../components/card/card'

import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/banner/banner'
import styles from '../styles/Home.module.css'
import coffeeStoresData from '../data/coffee-stores.json';

export async function getStaticProps(context) {
  return {
    props: {
      coffeeStores: coffeeStoresData
    }
  }
}

export default function Home(props) {
  const { coffeeStores } = props; 
  const handleBannerButtonClick = () => {
    console.log('Banner button clicked')
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home | Coffee Connoisseur</title>
        <link rel='icon' href='/favicon.ico'/>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Coffee Connoisseur</h1>
        <Banner buttonText={'View stores nearby'} handleButtonClick={handleBannerButtonClick}/>
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={700} height={400} alt="hero"/>
        </div>
        {coffeeStores.length > 0 && 
          <>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore)=>(
                <Card 
                key={coffeeStore.id}
                name={coffeeStore.name}
                imgUrl={coffeeStore.imgUrl} 
                href={`/coffee-stores/${coffeeStore.id}`}
                className={styles.card}
                />
                ))}
              </div>
          </>
        }
      </main>
    </div>
  )
}
