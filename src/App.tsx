import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, football, podium, trophy } from 'ionicons/icons';

import Equipos from './pages/Equipos';
import EquipoDetalle from './pages/EquipoDetalle';
import Calendario from './pages/Calendario';
import Quiniela from './pages/Quiniela';
import Torneo from './pages/Torneo';
import Campeon from './pages/Campeon';

import { LiveDataProvider } from './context/LiveDataContext';
import { QuinielaProvider } from './context/QuinielaContext';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    {/* LiveDataProvider envuelve a QuinielaProvider porque la quiniela depende de los marcadores en vivo */}
    <LiveDataProvider>
      <QuinielaProvider>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/equipos" component={Equipos} />
              <Route exact path="/equipos/:codigo" component={EquipoDetalle} />
              <Route exact path="/calendario" component={Calendario} />
              <Route exact path="/quiniela" component={Quiniela} />
              <Route exact path="/torneo" component={Torneo} />
              <Route exact path="/campeon" component={Campeon} />
              <Route exact path="/"><Redirect to="/equipos" /></Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="equipos" href="/equipos">
                <IonIcon icon={football} />
                <IonLabel>Equipos</IonLabel>
              </IonTabButton>
              <IonTabButton tab="calendario" href="/calendario">
                <IonIcon icon={calendar} />
                <IonLabel>Calendario</IonLabel>
              </IonTabButton>
              <IonTabButton tab="quiniela" href="/quiniela">
                <IonIcon icon={podium} />
                <IonLabel>Quiniela</IonLabel>
              </IonTabButton>
              <IonTabButton tab="torneo" href="/torneo">
                <IonIcon icon={trophy} />
                <IonLabel>Torneo</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </QuinielaProvider>
    </LiveDataProvider>
  </IonApp>
);

export default App;
