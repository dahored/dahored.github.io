import Button from "@/app/components/button";
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
        </main>
    );
}