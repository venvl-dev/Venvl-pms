import { Icon } from "./Icon";
import { cx } from "../../lib/cx";
import styles from "./Aminites.module.css";

type AmenityProps = {
  icon?: string;
  label: string;
  muted?: boolean;
};

export function Amenity({ icon = "check", label, muted = false }: AmenityProps) {
  return (
    <div className={cx(styles.item, muted && styles.muted)}>
      <span className={styles.iconWrap}>
<Icon name={icon !== "check" ? icon : label} size={20} strokeWidth={1.8} color="var(--success)" />
      </span>
      <span className={cx(styles.label, muted && styles.mutedLabel)}>{label}</span>
    </div>
  );
}
