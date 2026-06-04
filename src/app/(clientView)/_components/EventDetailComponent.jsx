import Image from "next/image";
import Link from "next/link";
import styles from "./detail.module.css";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDetailDate(dateString) {
  if (!dateString) return "Date TBD";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function EventDetailComponent({ event }) {
  const imageSrc = event.poster?.startsWith("/")
    ? event.poster
    : "/images/presentation.png";
  const isRemote =
    imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/#content" className={styles.backLink}>
        <BackIcon />
        Back to events
      </Link>

      <article className={styles.card}>
        <div className={styles.banner}>
          <Image
            src={imageSrc}
            alt={event.eventName}
            fill
            className={styles.bannerImage}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            unoptimized={isRemote}
          />
        </div>

        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{event.eventName}</h1>
            <span
              className={event.isOpen ? styles.statusOpen : styles.statusClosed}
            >
              {event.isOpen ? "Open" : "Close"}
            </span>
          </div>

          <p className={styles.description}>{event.longDescription}</p>
          <p className={styles.location}>{event.address}</p>
          <span className={styles.dateBadge}>
            {formatDetailDate(event.startDate)}
          </span>

          {event.agenda?.length > 0 && (
            <section className={styles.agendaSection}>
              <h2 className={styles.agendaTitle}>Agenda Management</h2>
              <div className={styles.agendaList}>
                {event.agenda.map((item, index) => (
                  <div
                    key={item.id}
                    className={`${styles.agendaItem} ${
                      index % 2 === 0
                        ? styles.agendaItemAlt
                        : styles.agendaItemPlain
                    }`}
                  >
                    <div
                      className={
                        item.accent === "purple"
                          ? styles.accentPurple
                          : styles.accentGreen
                      }
                      aria-hidden
                    />
                    <div>
                      <p className={styles.agendaTime}>{item.time}</p>
                      <h3 className={styles.agendaItemTitle}>{item.title}</h3>
                      {item.description && (
                        <p className={styles.agendaDesc}>{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.footerRow}>
                {event.isOpen ? (
                  <Link
                    href={`/register/${event.eventId}`}
                    className={styles.joinBtn}
                  >
                    Join Event
                  </Link>
                ) : (
                  <p className={styles.closedNote}>Registration is closed</p>
                )}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
