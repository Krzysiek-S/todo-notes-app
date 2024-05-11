import styles from "./todos/styles.module.css";

const Light = ({ children }: any) => {
  return <div className={styles.lightSource}>{children}</div>;
};

export default Light;
