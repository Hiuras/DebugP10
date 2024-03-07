import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData(); // Récupération des données et des erreurs éventuelles
  const [type, setType] = useState(); // État pour la catégorie sélectionnée
  const [currentPage, setCurrentPage] = useState(1); // État pour la page actuelle

  let filteredEvents = []; // Initialisation du tableau d'événements filtrés
  // Filtre en fonction du type sélectionné
  if (data?.events) {
    if (type) {
      filteredEvents = data.events.filter((event) => event.type === type);
    } else {
      filteredEvents = data.events;
    }
  }
  
  // Trier les événements filtrés par date du plus récent au plus ancien
  filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pagination des événements filtrés
  filteredEvents = filteredEvents.filter(
    (event, index) =>
      (currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index
  );

  // Fonction pour changer le type de catégorie et réinitialiser la page
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  // Création d'un ensemble de types pour le menu déroulant
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          {/* Affichage du titre de la sélection */}
          <h3 className="SelectTitle">Catégories</h3>
          {/* Sélection du type d'événement à afficher */}
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          {/* Conteneur pour afficher les événements filtrés */}
          <div id="events" className="ListContainer">
            {/* Affichage de chaque événement filtré sous forme de carte événementielle */}
            {filteredEvents.map(
              (event) =>
                event && (
                  <Modal key={event.id} Content={<ModalEvent event={event} />}>
                    {({ setIsOpened }) => (
                      <EventCard
                        onClick={() => setIsOpened(true)}
                        imageSrc={event.cover}
                        title={event.title}
                        date={new Date(event.date)}
                        label={event.type}
                      />
                    )}
                  </Modal>
                )
            )}
          </div>
          {/* Pagination pour naviguer entre les pages d'événements */}
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
