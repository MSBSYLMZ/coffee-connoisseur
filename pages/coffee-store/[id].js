import { useRouter } from 'next/router'
import Image from 'next/image';

const CoffeeStore = () => {
    const router = useRouter();

    return (
        <div>
            {router.query.id}
        </div>
    )
}

export default CoffeeStore