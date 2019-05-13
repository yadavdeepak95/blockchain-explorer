/**
 *    SPDX-License-Identifier: Apache-2.0
 */
import ChaincodeForm from './ChaincodeForm';

const setup = () => {
	const wrapper = shallow(<ChaincodeForm />);

	return {
		wrapper
	};
};

describe('ChaincodeForm', () => {
	test('FooterView component should render', () => {
		const { wrapper } = setup();
		expect(wrapper.exists()).toBe(true);
	});
});
