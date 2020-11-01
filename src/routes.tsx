import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import ConfigureDebt from "./pages/ConfigureDebt/ConfigureDebt";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ConfigureDebt} />
        <Route path="/ConfigureDebt" component={ConfigureDebt} />
        {/* <Route path="/app" component={OrphanagesMap} />

        <Route path="/orphanages/create" component={CreateOrphanage} />
        <Route path="/orphanages/:id" component={Orphanage} /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;