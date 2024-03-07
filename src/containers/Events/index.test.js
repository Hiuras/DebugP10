import { fireEvent, render, screen } from "@testing-library/react";
import { api, DataProvider } from "../../contexts/DataContext";
import Events from "./index";

// Les données simulées pour les tests
const data = {
  events: [
    {
      id: 1,
      type: "soirée entreprise",
      date: "2022-04-29T20:28:45.744Z",
      title: "Conférence #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: [
        "1 espace d’exposition",
        "1 scéne principale",
        "2 espaces de restaurations",
        "1 site web dédié",
      ],
    },
    {
      id: 2,
      type: "forum",
      date: "2022-04-29T20:28:45.744Z",
      title: "Forum #productCON",
      cover: "/images/stem-list-EVgsAbL51Rk-unsplash.png",
      description:
        "Présentation des outils analytics aux professionnels du secteur",
      nb_guesses: 1300,
      periode: "24-25-26 Février",
      prestations: ["1 espace d’exposition", "1 scéne principale"],
    },
  ],
};

// Suite de tests pour le composant Events
describe("When Events is created", () => {
  // Test : une liste de cartes d'événements est affichée
  it("a list of event card is displayed", async () => {
    // Simulation de l'appel à une fonction API pour charger les données
    api.loadData = jest.fn().mockReturnValue(data);
    // Rendu du composant Events dans le DataProvider
    render(
      <DataProvider>
        <Events />
      </DataProvider>
    );
    // Attente de l'affichage du texte contenant "avril" (mois de l'événement)
    await screen.findByText("avril");
  });

  // Suite de tests pour le cas où une erreur survient
  describe("and an error occured", () => {
    // Test : un message d'erreur est affiché
    it("an error message is displayed", async () => {
      // Simulation de l'appel à une fonction API qui échoue
      api.loadData = jest.fn().mockRejectedValue();
      // Rendu du composant Events dans le DataProvider
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
      // Vérification que le texte "An error occured" est affiché
      expect(await screen.findByText("An error occured")).toBeInTheDocument();
    });
  });

  // Suite de tests pour le cas où une catégorie est sélectionnée
  describe("and we select a category", () => {
    // Test : une liste filtrée est affichée
    it.only("an filtered list is displayed", async () => {
      // Simulation de l'appel à une fonction API pour charger les données
      api.loadData = jest.fn().mockReturnValue(data);
      // Rendu du composant Events dans le DataProvider
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
      // Attente de l'affichage du texte d'un événement
      await screen.findByText("Forum #productCON");
      // Déclenchement d'un clic sur le bouton de collapse (masquage)
      fireEvent(
        await screen.findByTestId("collapse-button-testid"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      // Déclenchement d'un clic sur un élément du filtre de catégorie
      fireEvent(
        (await screen.findAllByText("soirée entreprise"))[0],
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      // Attente de l'affichage du texte d'un événement de la catégorie sélectionnée
      await screen.findByText("Conférence #productCON");
      // Vérification que l'événement non filtré n'est plus présent
      expect(screen.queryByText("Forum #productCON")).not.toBeInTheDocument();
    });
  });

  // Suite de tests pour le cas où un événement est cliqué
  describe("and we click on an event", () => {
    // Test : les détails de l'événement sont affichés
    it("the event detail is displayed", async () => {
      // Simulation de l'appel à une fonction API pour charger les données
      api.loadData = jest.fn().mockReturnValue(data);
      // Rendu du composant Events dans le DataProvider
      render(
        <DataProvider>
          <Events />
        </DataProvider>
      );
      // Déclenchement d'un clic sur le texte de l'événement
      fireEvent(
        await screen.findByText("Conférence #productCON"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
      // Attente de l'affichage du texte de la période de l'événement
      await screen.findByText("24-25-26 Février");
      // Attente de l'affichage du texte d'une prestation de l'événement
      await screen.findByText("1 site web dédié");
    });
  });
});