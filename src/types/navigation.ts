import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Delivery } from './index';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  DeliveryDetail: { delivery: Delivery };
};

export type TabParamList = {
  Dashboard: undefined;
  Deliveries: undefined;
  Profile: undefined;
};

export type DashboardScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Dashboard'>;
export type DeliveriesScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Deliveries'> & {
  navigate: (screen: 'DeliveryDetail', params: { delivery: Delivery }) => void;
};
export type ProfileScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Profile'>;
export type DeliveryDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DeliveryDetail'>;