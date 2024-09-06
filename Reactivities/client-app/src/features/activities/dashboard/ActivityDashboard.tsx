//import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponents from "../../../app/layout/LoadingComponents";

export default observer( function ActivityDashboard() {

    const {activityStore} = useStore();
    const {loadActivities, ActivityRegistry} = activityStore

    useEffect(() => {
        if (ActivityRegistry.size <= 1) loadActivities();
    }, [loadActivities])

    if (activityStore.loadingInitial) return <LoadingComponents content='Loading app' />

    return(
        <Grid>
            <GridColumn width='10'>
                <ActivityList />
            </GridColumn>
            <GridColumn width='6'>
                <h2>Activity filters</h2>
            </GridColumn>
        </Grid>
    )
})