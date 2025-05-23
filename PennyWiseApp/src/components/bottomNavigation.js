import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BottomNavigation = ({navigation, currentTab}) => {
    const navigationItems = [
        // handleNavigation will use the route value to tell react navigation which screen to go to (using navigation.navigate(route))
        {name:'Notifications', icon:'notifications', route:'Notifications'},
        {name:'Home', icon:'home', route:'Home'},
        {name:'Profile', icon:'person', route:'Profile'}
    ];

    const handleNavigation = (route) => {
        if (route === 'Home') {
            navigation.navigate('Home');
        } else {
            console.log(`Temporary placeholder: Navigating to the ${route} page`);
        }
    };

    // build the page
    return (
        <View style={styles.bottomNav}>
            {navigationItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.navigationItems}
                    onPress={() => handleNavigation(item.route)}
                >
                    <Icon name={item.icon} size={20} 
                        color={currentTab == item.route ? '#2ECC71' : '#888'}/>
                    <Text style={[
                        styles.navigationText, 
                        {color: currentTab == item.route ? '#2ECC71' : '#888'}
                        ]}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
};

const styles = StyleSheet.create({
    bottomNav: {flexDirection:'row', justifyContent:'space-around', padding:10, backgroundColor:'#fff', borderTopWidth:1, bordorTopColor:'#ddd'},
    navigationItems: {alignItems:'center', width:'30%'},
    navigationText: {fontSize:12}
});

export default BottomNavigation;