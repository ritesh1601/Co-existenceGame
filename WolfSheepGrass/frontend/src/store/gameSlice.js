import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: null,

    entities: [],

    selectedEntity: null,

    initialEntityCounts: {
        grass: 0,
        sheep: 0,
        wolf: 0
    },

    loading: false,

    error: null
};


function getMaximumForEntity(session, entityType) {

    if (entityType === "grass") {
        return Number(session.maxInitialGrass);
    }

    if (entityType === "sheep") {
        return Number(session.maxInitialSheep);
    }

    if (entityType === "wolf") {
        return Number(session.maxInitialWolves);
    }

    return 0;
}


function canPlaceEntity(
    entities,
    row,
    column,
    entityType
) {

    const entitiesAtPosition =
        entities.filter(
            (entity) =>
                entity.row === row &&
                entity.column === column
        );

    if (entitiesAtPosition.length === 0) {
        return true;
    }

    for (const entity of entitiesAtPosition) {

        // Same entity type cannot occupy
        // the same cell.
        if (entity.type === entityType) {
            return false;
        }

        // Grass + Sheep allowed
        // Grass + Wolf allowed
        if (
            entity.type === "grass" &&
            (
                entityType === "sheep" ||
                entityType === "wolf"
            )
        ) {
            continue;
        }

        // Sheep + Grass allowed
        // Wolf + Grass allowed
        if (
            entityType === "grass" &&
            (
                entity.type === "sheep" ||
                entity.type === "wolf"
            )
        ) {
            continue;
        }

        // Sheep + Wolf not allowed
        return false;
    }

    return true;
}


const gameSlice = createSlice({

    name: "game",

    initialState,

    reducers: {

        setGameSession(state, action) {

            state.session = action.payload;
        },


        setEntities(state, action) {

            state.entities = action.payload;

            /*
             * When loading an existing game,
             * count the entities currently stored
             * as the initial setup.
             *
             * This is mainly useful for a game that
             * has not started simulation yet.
             */
            if (
                state.session &&
                state.session.currentDay === 0
            ) {

                state.initialEntityCounts = {
                    grass: action.payload.filter(
                        entity =>
                            entity.type === "grass"
                    ).length,

                    sheep: action.payload.filter(
                        entity =>
                            entity.type === "sheep"
                    ).length,

                    wolf: action.payload.filter(
                        entity =>
                            entity.type === "wolf"
                    ).length
                };
            }
        },


        setSelectedEntity(state, action) {

            state.selectedEntity = action.payload;
        },


        placeEntity(state, action) {

            const {
                row,
                column
            } = action.payload;

            const entityType =
                state.selectedEntity;

            if (!entityType) {
                return;
            }

            if (!state.session) {
                return;
            }

            /*
             * Initial entity limits only apply
             * while creating the initial setup.
             */
            if (state.session.currentDay !== 0) {
                return;
            }

            const maxAllowed =
                getMaximumForEntity(
                    state.session,
                    entityType
                );

            const currentCount =
                state.initialEntityCounts[
                    entityType
                ];

            /*
             * Initial placement limit reached.
             */
            if (currentCount >= maxAllowed) {
                return;
            }

            /*
             * Check whether this cell allows
             * the selected entity.
             */
            if (
                !canPlaceEntity(
                    state.entities,
                    row,
                    column,
                    entityType
                )
            ) {
                return;
            }

            /*
             * Temporary frontend ID.
             */
            state.entities.push({

                id: -(
                    state.entities.length + 1
                ),

                type: entityType,

                row,

                column,

                daysWithoutFood: 0
            });

            /*
             * Increase only the INITIAL
             * placement count.
             */
            state.initialEntityCounts[
                entityType
            ]++;
        },


        setLoading(state, action) {

            state.loading = action.payload;
        },


        setError(state, action) {

            state.error = action.payload;
        },


        clearGame(state) {

            state.session = null;

            state.entities = [];

            state.selectedEntity = null;

            state.initialEntityCounts = {
                grass: 0,
                sheep: 0,
                wolf: 0
            };

            state.loading = false;

            state.error = null;
        }
    }
});


export const {
    setGameSession,
    setEntities,
    setSelectedEntity,
    placeEntity,
    setLoading,
    setError,
    clearGame
} = gameSlice.actions;


export default gameSlice.reducer;