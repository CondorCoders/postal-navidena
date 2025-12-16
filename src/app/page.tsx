import { PostalForm } from "@/components/postal-form/postal-form";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.container}>
          <PostalForm />
        </div>
      </main>
    </div>
  );
}
