import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from "react-native";
import trackerApi from "../../api/tracker";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const BatchCodes = ["2027A", "2027B", "2026A", "2026B", "2025A", "2025B"];

const ATimeTable = () => {
    const [batchCode, setBatchCode] = useState("");
    const [numSets, setNumSets] = useState(1);
    const [formData, setFormData] = useState([createInitialFormData()]);
    function createInitialFormData() {
        const placeholders = [
            "Module Name",
            "Module Code",
            "Venue",
            "Session Start Time",
            "Session End Time",
            "Session Start Date",
            "Session End Date",
        ];
        const initialData = placeholders.map((placeholder) => ({
            placeholder,
            value: "",
        }));
        return initialData;
    }

    const renderPlaceholders = () => {
        const placeholders = [];
        for (let set = 0; set < numSets; set++) {
            const setFormData = formData[set];
            if (!setFormData) {
                continue; // Skip undefined setFormData
            } // Add space and headline for set > 1
            if (set > 0) {
                placeholders.push(
                    <View key={`spacer_${set}`} style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            Set {set + 1}
                        </Text>
                    </View>
                );
            }
            for (let i = 0; i < setFormData.length; i++) {
                const placeholderData = setFormData[i];
                const inputValue = placeholderData.value;
                placeholders.push(
                    <View key={`${set}_${i}`} style={{ padding: 10 }}>
                        <TextInput
                            value={inputValue}
                            onChangeText={(text) => handleInputChange(set, i, text)}
                            style={{
                                padding: 10,
                                borderColor: "#828282",
                                borderRadius: 15,
                                width: 350 /* ...Platform.select({
                                  ios: {
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                  },
                                  android: {
                                    elevation: 5,
                                  },
                                }) */,
                            }}
                            placeholder={`${placeholderData.placeholder}`}
                            backgroundColor="white"
                            placeholderTextColor={"#828282"}
                        />
                    </View>
                );
            } // Add the "+" button only after the last set
            if (set === numSets - 1) {
                placeholders.push(
                    <TouchableOpacity
                        key={`button_${set}`}
                        onPress={addPlaceholders}
                        style={{ padding: 10, marginTop: 10 }}
                    >
                        <Text
                            style={{ fontSize: 40, fontWeight: "bold", color: "#484BF1" }}
                        >
                            +
                        </Text>
                    </TouchableOpacity>
                );
            }
        }
        return placeholders;
    };

    const addPlaceholders = () => {
        setNumSets(numSets + 1);
        const newFormData = [...formData, createInitialFormData()];
        setFormData(newFormData);
    };

    const handleInputChange = (set, index, text) => {
        const updatedData = [...formData];
        updatedData[set][index] = { ...updatedData[set][index], value: text };
        setFormData(updatedData);
    };

    const handleSubmit = async () => {
        // Log the entered data to the console
        const timetable1 = formData;
        const response = await trackerApi.post("/api/saveTimetable", {
            batchCode,
            timetable1,
        }); // Reset batch code and placeholders after submitting
        setBatchCode("");
        setFormData([createInitialFormData()]);
    };

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
                paddingBottom: 480,
            }}
        >
            <View
                style={{
                    backgroundColor: "#484BF1",
                    width: "100%",
                    height: 18,
                    marginBottom: 30,
                }}
            ></View>
            <View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Set 1</Text>
            </View>
            <View>
                <SelectDropdown
                    data={BatchCodes}
                    onSelect={(selectedItem, index) => {
                        setBatchCode(selectedItem);
                    }}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View style={styles.dropdownButtonStyle}>
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedItem || "Select Batch Code"}
                                </Text>
                                <Icon
                                    name={isOpened ? "chevron-up" : "chevron-down"}
                                    style={styles.dropdownButtonArrowStyle}
                                />
                            </View>
                        );
                    }}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View
                                style={{
                                    ...styles.dropdownItemStyle,
                                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                                }}
                            >
                                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            {renderPlaceholders()}
            <View>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: "rgba(0, 122, 255, 0.7)",
                        padding: 8,
                        marginTop: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                        width: 180,
                    }}
                >
                    <Text style={{ fontWeight: "bold", color: "white" }}>Sumbit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: 350,
        backgroundColor: "white",
        padding: 10,
        marginTop: 5,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center" /* ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 5,
        },
      }) */,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 14, //fontWeight: '500',
        color: "black",
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: "#E9ECEF",
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 14,
        color: "#151E26",
    },
});
export default ATimeTable;
