import styles from "@/app/assets/styles/modules/components.module.scss";
import Button from "@/app/components/button";
import Icon from "@/app/components/icon";
import Title from "@/app/components/title";
import Paragraph from "@/app/components/paragraph";
import Image from "next/image";

export default function AllComponents() {
    return (
        <main className={styles.container}>
            <h1 className={styles.sectionTitle}>Components</h1>
            <div className={styles.wrapper}>
                <h2 className={styles.sectionTitle}>Button</h2>
                <div className={`${styles.components} ${styles.componentsInline}`}>
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button>
                        <Icon icon="arrow-down-circle"/> With icon
                    </Button>
                    <Button>
                        With icon <Icon icon="arrow-down-circle"/>
                    </Button>
                    <Button>
                        <Icon icon="arrow-down-circle"/>
                    </Button>
                </div>
            </div>

            <div className={styles.wrapper}>
                <h2 className={styles.sectionTitle}>Icon</h2>
                <div className={`${styles.components} ${styles.componentsInline}`}>
                    <Icon icon="cloud-plus"/>
                    <Icon icon="person"/>
                    <Icon icon="arrow-down-circle"/>
                </div>
            </div>

            <div className={styles.wrapper}>
                <h2 className={styles.sectionTitle}>Titles</h2>
                <div className={`${styles.components}`}>
                    <Title title="Title h1" variant="h1"/>
                    <Title title="Title h2" variant="h2"/>
                    <Title title="Title h3" variant="h3"/>
                    <Title title="Title h4" variant="h4"/>
                    <Title title="Title h5" variant="h5"/>
                    <Title title="Title h6" variant="h6"/>
                </div>
            </div>

            <div className={styles.wrapper}>
                <h2 className={styles.sectionTitle}>Paragraphs</h2>
                <div className={`${styles.components}`}>
                    <Paragraph>Paragraph</Paragraph>
                </div>
            </div>

            <div className={styles.wrapper}>
                <h2 className={styles.sectionTitle}>Images</h2>
                <div className={`${styles.components}`}>
                    <Image
                        src="/vercel.svg"
                        alt="Vercel Logo"
                        className={styles.vercelLogo}
                        width={100}
                        height={24}
                        priority
                    />
                </div>
            </div>
        </main>
    );
}