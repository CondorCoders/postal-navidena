import { PostalForm } from "@/components/postal-form/postal-form";
import { Snow } from "@/components/snow";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <Snow />
        <div className={styles.container}>
          <PostalForm />
        </div>
      </main>
    </div>
  );
}
