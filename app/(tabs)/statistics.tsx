import {
    fetchMonthlyStats,
    fetchWeeklyStats,
    fetchYearlyStats,
} from "@/app/services/transactionService";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { showAlert } from "@/utils/alerts";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const Statistics = () => {
    const { user } = useAuth();
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [chartLoading, setChartLoading] = React.useState(false);
    const [chartData, setChartData] = React.useState<any[]>([]);
    const [transaction, setTransaction] = React.useState<any[]>([]);

    // Function to prepare chart data with alternating colors
    const prepareChartData = (data: any[]) => {
        if (!data || data.length === 0) return [];
        
        return data.map((item, index) => ({
            ...item,
            color: index % 2 === 0 ? colors.green : colors.rose,
        }));
    };
    useEffect(() => {
        if (activeIndex == 0) {
            getWeeklyStats();
        }
        if (activeIndex == 1) {
            getMonthlyStats();
        }
        if (activeIndex == 2) {
            getYearlyStats();
        }
    }, [activeIndex]);
    const getWeeklyStats = async () => {
        setChartLoading(true);
        let res = await fetchWeeklyStats(user?.uid as string);
        setChartLoading(false);
        if (res.success) {
            setChartData(prepareChartData(res?.data?.stats));
            setTransaction(res?.data?.transactions);
        } else {
            showAlert.error("Error", res.msg || "Failed to fetch weekly statistics");
        }

    };
    const getMonthlyStats = async () => {
        setChartLoading(true);
        let res = await fetchMonthlyStats(user?.uid as string);
        setChartLoading(false);
        if (res.success) {
            setChartData(prepareChartData(res?.data?.stats));
            setTransaction(res?.data?.transactions);
        } else {
            showAlert.error("Error", res.msg || "Failed to fetch monthly statistics");
        }
    };
    const getYearlyStats = async () => {
        setChartLoading(true);
        let res = await fetchYearlyStats(user?.uid as string);
        setChartLoading(false);
        if (res.success) {
            setChartData(prepareChartData(res?.data?.stats));
            setTransaction(res?.data?.transactions);
        } else {
            showAlert.error("Error", res.msg || "Failed to fetch yearly statistics");
        }
    };
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header title="Statistics" />
                </View>
                <ScrollView
                    contentContainerStyle={{
                        gap: spacingY._20,
                        paddingTop: spacingY._5,
                        paddingBottom: verticalScale(100),
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <SegmentedControl
                        values={["Weekly", "Monthly", "Yearly"]}
                        selectedIndex={activeIndex}
                        onChange={(event) => {
                            setActiveIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                        tintColor={colors.neutral200}
                        backgroundColor={colors.neutral800}
                        appearance="dark"
                        activeFontStyle={styles.segmentFontStyle}
                        style={styles.segmentStyle}
                        fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
                    />

                    <View style={styles.chartContainer}>
                        {chartData.length > 0 ? (
                            <BarChart
                                data={chartData}
                                barWidth={scale(12)}
                                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                                roundedTop
                                roundedBottom
                                hideRules
                                yAxisLabelPrefix="$"
                                yAxisThickness={1}
                                xAxisThickness={0}
                                yAxisLabelWidth={
                                    [1, 2].includes(activeIndex) ? scale(38) : scale(35)
                                }
                                hideYAxisText={false}
                                yAxisTextStyle={{ 
                                    color: colors.neutral350,
                                    fontSize: verticalScale(11)
                                }}
                                xAxisLabelTextStyle={{
                                    color: colors.neutral350,
                                    fontSize: verticalScale(12),
                                }}
                                noOfSections={3}
                                minHeight={5}
                                isAnimated={true}
                                animationDuration={1000}
                                barBorderRadius={4}
                                showGradient={false}
                                barStyle={{
                                    borderRadius: 4,
                                }}
                            />
                        ) : (
                            <View style={styles.noChart}></View>
                        )}
                    </View>
                    <View>
                        <TransactionList
                            data={transaction}
                            title="Transactions"
                            emptyListMessage="No transactions found for this period."
                        />
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default Statistics;

const styles = StyleSheet.create({
    chartContainer: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    chartLoadingContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: radius._12,
        backgroundColor: "[rgba(0,0,0, 0.6)",
    },
    header: {},
    noChart: {
        backgroundColor: "[rgba(0,0,0, 0.6)",
        height: verticalScale(210),
    },
    searchIcon: {
        backgroundColor: colors.neutral700,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        height: verticalScale(35),
        width: verticalScale(35),
        borderCurve: "continuous",
    },
    segmentStyle: {
        height: scale(37),
    },
    segmentFontStyle: {
        fontSize: verticalScale(13),
        fontWeight: "bold",
        color: colors.black,
    },
    container: {
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._5,
        gap: spacingY._10,
    },
});