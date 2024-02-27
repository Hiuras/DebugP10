import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  // Obtenez les données à partir du contexte DataContext
  const { data } = useData();

  // État pour suivre l'index de la slide actuel
  const [index, setIndex] = useState(0);

  // Triez les données par date dans l'ordre décroissant
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  // Effet pour changer automatiquement la diapositive toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
    }, 5000);
    
    // Remet à zéro l'intervalle au changement d'image, qu'il soit automatique ou manuel
    return () => clearInterval(interval);
  }, [byDateDesc]);

  // Fonction pour changer de slide lorsqu'un bouton radio est cliqué
  const handleRadioChange = (radioIdx) => {
    setIndex(radioIdx);
  };

  return (
    <div className="SlideCardList">
      {/* Mappez les données et affichez chaque diapositive */}
      {byDateDesc?.map((event, idx) => (
        <div key={event.id}>
          {/* Affiche la diapositive seulement si son index correspond à l'index actuel */}
          <div className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Affiche les boutons de pagination */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((event, radioIdx) => (
            // Bouton radio qui est coché si son index correspond à l'index actuel
            <input
              key={event.id}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => handleRadioChange(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;