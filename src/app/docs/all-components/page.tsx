import Button from "@/app/components/button";
import Icon from "@/app/components/icon";
import styles from "@/app/assets/styles/modules/components.module.scss";

export default function AllComponents() {
    return (
        <main className={styles.container}>
            <h1>Components</h1>
            <div className={styles.wrapper}>
                <h2>Button</h2>
                <div className={`${styles.components} ${styles.componentsInline}`}>
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                </div>
            </div>
            <div className={styles.wrapper}>
                <h2>Icon</h2>
                <div className={`${styles.components} ${styles.componentsInline}`}>
                    <Icon icon="cloud-plus"/>
                    <Icon icon="person"/>
                    <Icon icon="arrow-down-circle"/>
                </div>
            </div>
        </main>
    );
}