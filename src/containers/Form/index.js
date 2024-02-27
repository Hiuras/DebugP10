import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

// Fonction fictive pour simuler un appel API de contact
const mockContactApi = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 900);
  });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);

  // Fonction pour envoyer le formulaire de contact
  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);
      // Appel à l'API fictive pour le contact
      try {
        await mockContactApi();
        setSending(false);
        // Appel de la fonction onSuccess si le contact est réussi
        onSuccess();
      } catch (err) {
        setSending(false);
        // Appel de la fonction onError en cas d'erreur lors du contact
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          {/* Champ de saisie pour le nom */}
          <Field placeholder="" label="Nom" />
          {/* Champ de saisie pour le prénom */}
          <Field placeholder="" label="Prénom" />
          {/* Sélection du type de contact (personnel ou entreprise) */}
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          {/* Champ de saisie pour l'e-mail */}
          <Field placeholder="" label="Email" />
          {/* Bouton d'envoi du formulaire */}
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          {/* Champ de saisie pour le message */}
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
    </form>
  );
};

// Spécification des types de props attendus
Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

// Valeurs par défaut des props
Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;