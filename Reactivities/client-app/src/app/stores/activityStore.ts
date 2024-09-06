import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from '../api/agent';
import {v4 as uuid} from 'uuid'

export default class ActivityStore {
    // activities: Activity[] = [];
    ActivityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor(){
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.ActivityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        // if (this.loadingInitial) return; 
        this.setLoadingInitial(true);
        // console.log('set true');
        try {
            // this.setLoadingInitial(false);
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);                
            })
            this.setLoadingInitial(false);
            // console.log('set false');         
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);         
        } finally {
            this.setLoadingInitial(false); // Ensure loading is set to false after fetch or error
        }     
    }
    
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try{
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private getActivity = (id: string) => {
        return this.ActivityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.ActivityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                // this.activities.push(activity);
                this.ActivityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    
    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.ActivityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.ActivityRegistry.delete(id);
                this.loading = false;
            })
        } catch(error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}