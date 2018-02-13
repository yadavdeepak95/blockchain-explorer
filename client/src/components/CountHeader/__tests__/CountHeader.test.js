import React from "react";
import {
    mount,
    shallow
} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import CountHeader from "../CountHeader";

const middlewares = [];
const mockStore = configureStore(middlewares);
const initialState = {};

describe('Testing CountHeader', () => {
    let wrapper;
    it('renders as expected', () => {
        wrapper = shallow(<CountHeader />, {
            context: {
                store: mockStore(initialState)
            }
        },
        );
        expect(wrapper.dive()).toMatchSnapshot();
        const firstButton = wrapper.find('button').at(0);
        expect(firstButton).toBeDefined();
        expect(firstButton.length).toEqual(1);
        const ctx = wrapper.find('context');
        expect(ctx).toBeDefined();
    });
});