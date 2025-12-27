import {useNavigation} from '@react-navigation/native';
import {off, onValue, ref} from 'firebase/database';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {logoutUser} from '../features/authService';
import {firebaseAuth, firebaseDatabase} from '../services/firebaseConfig';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/helpers';
import {baseStyle, colors, sizes} from '../utils/theme';

export default function DashboardScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  // Fetch expenses for the currently logged-in user from Firebase Realtime DB
  useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (!user) return;

    const incomeRef = ref(firebaseDatabase, `incomeData/${user.uid}`);
    const expenseRef = ref(firebaseDatabase, `expenses/${user.uid}`);

    const handleIncome = snapshot => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        amount: Number(data[key]?.amount) || 0,
      }));
      setIncomeList(list);
      console.log('list: ', list);
    };

    const handleExpense = snapshot => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        amount: Number(data[key].amount) || 0,
      }));
      setExpenseList(list);
    };

    onValue(incomeRef, handleIncome);
    onValue(expenseRef, handleExpense);

    return () => {
      off(incomeRef);
      off(expenseRef);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setMenuVisible(false);
      navigation.reset({index: 0, routes: [{name: 'Login'}]});
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const totalIncome = incomeList?.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenseList?.reduce((sum, e) => sum + e.amount, 0);
  const savings = totalIncome - totalExpense;

  const allTransactions = [
    ...incomeList?.map(i => ({...i, type: 'Income'})),
    ...expenseList?.map(e => ({...e, type: 'Expense'})),
  ];

  const monthlyTotals = allTransactions.reduce((acc, item) => {
    if (!item.month) return acc; // 🚨 skip invalid records

    if (!acc[item.month]) {
      acc[item.month] = {income: 0, expense: 0};
    }

    if (item.type === 'Income') {
      acc[item.month].income += Number(item.amount || 0);
    } else {
      acc[item.month].expense += Number(item.amount || 0);
    }

    return acc;
  }, {});

  console.log('monthlyTotals...!', monthlyTotals);

  const sortedMonths = Object.keys(monthlyTotals).sort();
  const lineChartData = {
    labels: sortedMonths.map(m =>
      new Date(m + '-01').toLocaleString('en-IN', {month: 'short'}),
    ),
    datasets: [
      {
        data: sortedMonths.map(m => Number(monthlyTotals[m]?.income || 0)),
        color: opacity => `rgba(34,197,94,${opacity})`,
        strokeWidth: 3,
      },
      {
        data: sortedMonths.map(m => Number(monthlyTotals[m]?.expense || 0)),
        color: opacity => `rgba(239,68,68,${opacity})`,
        strokeWidth: 3,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  const hasLineChartData =
    sortedMonths.length > 0 &&
    (lineChartData.datasets[0].data.some(v => v > 0) ||
      lineChartData.datasets[1].data.some(v => v > 0));

  const savingsRate =
    totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  //for BAR CHAT
  const barData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        data: [totalIncome || 0, totalExpense || 0, savings > 0 ? savings : 0],
        colors: [
          () => '#22C55E', // Green - Income
          () => '#EF4444', // Red - Expenses
          () => '#3B82F6', // Blue - Savings
        ],
      },
    ],
  };

  const expenseCategoryTotals = expenseList.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const categoryColors = {
    'House Rent': '#f59e0b',
    'Utilities – Electricity': '#3b82f6',
    Water: '#8b5cf6',
    'Health Insurance premium': '#06b6d4',
    'Medical Expenses': '#84cc16',
    'Transportation – Monthly Travel Pass': '#ec4899',
    'Fuel Cost': '#ef4444',
    'School/College Fees': '#64748b',
  };

  const optionsCategory = [
    'House Rent',
    'Utilities – Electricity',
    'Water',
    'Health Insurance premium',
    'Medical Expenses',
    'Transportation – Monthly Travel Pass',
    'Fuel Cost',
    'School/College Fees',
  ];

  const pieData = optionsCategory
    .filter(cat => expenseCategoryTotals[cat])
    .map(cat => ({
      name: cat,
      amount: expenseCategoryTotals[cat],
      color: categoryColors[cat],
      legendFontColor: '#374151',
      legendFontSize: 12,
    }));

  const formatCurrency = amount =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const getBudgetHealthStyle = () => {
    if (savingsRate > 20) return styles.healthExcellent;
    if (savingsRate > 10) return styles.healthGood;
    return styles.healthPoor;
  };

  const getBudgetHealthText = () => {
    if (savingsRate > 20) return 'Excellent';
    if (savingsRate > 10) return 'Good';
    return 'Needs Attention';
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const currentMonth = new Date().toISOString().slice(0, 7); // "2025-12"

  const getPreviousMonth = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
  };

  const previousMonth = getPreviousMonth();

  const calcMonthTotals = (list, month) =>
    list
      .filter(item => item.month === month)
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const currentIncome = calcMonthTotals(incomeList, currentMonth);
  const previousIncome = calcMonthTotals(incomeList, previousMonth);

  const currentExpense = calcMonthTotals(expenseList, currentMonth);
  const previousExpense = calcMonthTotals(expenseList, previousMonth);

  const percentChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const incomeChange = percentChange(currentIncome, previousIncome);
  const expenseChange = percentChange(currentExpense, previousExpense);

  const netSavings = currentIncome - currentExpense;

  const savingsStatus =
    netSavings > 0 ? 'Financial health improving' : 'Needs attention';

  const categoryTotals = expenseList
    .filter(e => e.month === currentMonth)
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

  const categoryEntries = Object.entries(categoryTotals);

  let highestCategory = '-';
  let lowestCategory = '-';

  if (categoryEntries.length) {
    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    const sorted = categoryEntries.sort((a, b) => b[1] - a[1]);

    highestCategory = `${Math.round(
      (sorted[0][1] / total) * 100,
    )}% of total expenses`;

    lowestCategory = `${Math.round(
      (sorted[sorted.length - 1][1] / total) * 100,
    )}% of total expenses`;
  }
  const hasBarData = totalIncome > 0 || totalExpense > 0 || savings > 0;

  return (
    <ScrollView style={styles.container}>
      {/* 3-Dots Menu */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, {color: 'red'}]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            baseStyle.txtStyleOutPoppinSemiBold(sizes.size4, colors.black),
            {textAlign: 'center'},
          ]}>
          Family Budget
        </Text>
        <Text
          style={[
            baseStyle.txtStyleOutPoppinRegular(sizes.size2, colors.black),
            {textAlign: 'center'},
          ]}>
          Track your financial health
        </Text>

        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => setMenuVisible(true)}>
          <Icon name="more-vert" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Add Expense Button */}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.expenseButton}
            onPress={() => navigation.navigate('AddIncomeScreen')}>
            <Text
              style={[
                baseStyle.txtStyleOutPoppinSemiBold(sizes.size2, colors.black),
                {textAlign: 'center'},
              ]}>
              Add Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.expenseButton}
            onPress={() => navigation.navigate('AddExpenseForm')}>
            <Text
              style={[
                baseStyle.txtStyleOutPoppinSemiBold(sizes.size2, colors.black),
                {textAlign: 'center'},
              ]}>
              Add Expense
            </Text>
          </TouchableOpacity>
        </View>
        {/* Summary Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScrollView}>
          <View style={styles.cardsRow}>
            <View style={[styles.card, styles.incomeCard]}>
              <View style={[styles.iconContainer, styles.incomeIconBg]}>
                <Text style={styles.incomeIcon}>↑</Text>
              </View>
              <Text style={styles.cardLabel2}>Total Income</Text>
              <Text style={styles.cardAmount}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>

            <View style={[styles.card, styles.expenseCard]}>
              <View style={[styles.iconContainer, styles.expenseIconBg]}>
                <Text style={styles.expenseIcon}>↓</Text>
              </View>
              <Text style={styles.cardLabel2}>Total Expenses</Text>
              <Text style={styles.cardAmount}>
                {formatCurrency(totalExpense)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Pie Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Expense Breakdown</Text>
            <Text style={styles.chartSubtitle}>By category</Text>
          </View>

          {pieData.length > 0 ? (
            <PieChart
              data={pieData}
              width={Dimensions.get('window').width - 80}
              height={170}
              accessor={'amount'}
              backgroundColor={'transparent'}
              absolute
              chartConfig={{color: opacity => `rgba(0, 0, 0, ${opacity})`}}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📊</Text>
              <Text style={styles.emptyStateTitle}>No expenses yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Add transactions to see insights
              </Text>
            </View>
          )}
        </View>

        {/*Bar CHAT*/}
        <View style={styles.chartSection}>
          <Text style={[styles.chartTitle, {bottom: 10}]}>
            Income Vs. Expenses{' '}
          </Text>

          {hasBarData ? (
            <BarChart
              data={barData}
              width={Dimensions.get('window').width - 60}
              height={200}
              fromZero
              withCustomBarColorFromData
              flatColor
              yAxisLabel="₹ "
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: opacity => `rgba(0,0,0,${opacity})`,
                labelColor: () => '#6B7280',
              }}
            />
          ) : (
            <Text style={{textAlign: 'center', color: '#9CA3AF'}}>
              No income or expenses yet
            </Text>
          )}
        </View>
        {/* Line Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Financial Overview</Text>
          {/* <LineChart
            data={{
              labels: ['Income', 'Expense'],
              datasets: [{data: [totalIncome || 0, totalExpense || 0]}],
            }}
            width={Dimensions.get('window').width - 80}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#6366f1',
              backgroundGradientTo: '#8b5cf6',
              decimalPlaces: 0,
              color: opacity => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={styles.lineChart}
            bezier
          /> */}

          {hasLineChartData ? (
            <LineChart
              data={lineChartData}
              width={Dimensions.get('window').width - 60}
              height={220}
              bezier
              fromZero
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: opacity => `rgba(0,0,0,${opacity})`,
                labelColor: () => '#6B7280',
              }}
              style={{borderRadius: 16}}
            />
          ) : (
            <Text style={{textAlign: 'center', color: '#9CA3AF'}}>
              Not enough data to display chart
            </Text>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Key Highlights</Text>
          <View style={styles.statsContent}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Income</Text>
              <Text style={styles.statValue}>
                {incomeChange >= 0
                  ? `Increased by ${incomeChange}% from last month`
                  : `Decreased by ${Math.abs(incomeChange)}% from last month`}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Expenses</Text>
              <Text style={styles.statValue}>
                {' '}
                {expenseChange <= 0
                  ? `Decreased by ${Math.abs(expenseChange)}% from last month`
                  : `Increased by ${expenseChange}% from last month`}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Net Savings</Text>
              <Text style={styles.statValue}> {savingsStatus}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Highest Expense Category</Text>
              <Text style={styles.statValue}>{highestCategory}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Lowest Expense Category</Text>
              <Text style={styles.statValue}>{lowestCategory}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -24,
  },
  cardsScrollView: {
    marginBottom: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    width: 150,
  },
  incomeCard: {borderLeftWidth: 4, borderLeftColor: '#10b981'},
  expenseCard: {borderLeftWidth: 4, borderLeftColor: '#f43f5e'},
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  incomeIconBg: {backgroundColor: '#d1fae5'},
  expenseIconBg: {backgroundColor: '#ffe4e6'},
  incomeIcon: {color: '#059669', fontSize: 24, fontWeight: 'bold'},
  expenseIcon: {color: '#e11d48', fontSize: 24, fontWeight: 'bold'},
  cardLabel: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  cardLabel2: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
  cardAmount: {color: '#111827', fontWeight: 'bold', fontSize: 20},
  chartSection: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  chartHeader: {marginBottom: 16},
  chartTitle: {fontSize: 20, fontWeight: 'bold', color: '#1f2937'},
  chartSubtitle: {color: '#6b7280', fontSize: 14, marginTop: 4},
  chartContainer: {alignItems: 'center'},
  lineChart: {borderRadius: 16},
  emptyState: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyStateIcon: {fontSize: 48, marginBottom: 12},
  emptyStateTitle: {color: '#6b7280', fontWeight: '600', fontSize: 16},
  emptyStateSubtitle: {color: '#9ca3af', fontSize: 14, marginTop: 4},
  statsSection: {
    backgroundColor: '#fffbeb',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsContent: {gap: 12},
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {color: '#4b5563', fontWeight: '500'},
  statValue: {color: '#111827', fontWeight: 'bold'},
  statDivider: {height: 1, backgroundColor: '#fde68a'},
  healthBadge: {paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12},
  healthExcellent: {backgroundColor: '#d1fae5'},
  healthGood: {backgroundColor: '#fef3c7'},
  healthPoor: {backgroundColor: '#ffe4e6'},
  healthBadgeText: {fontWeight: 'bold', fontSize: 12},

  // 3-dot menu
  menuIcon: {position: 'absolute', top: 50, right: 20},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 70,
    marginRight: 20,
    width: 180,
    paddingVertical: 10,
    elevation: 5,
  },
  menuItem: {paddingVertical: 12, paddingHorizontal: 16},
  menuText: {fontSize: 16, color: '#111827'},
  menuDivider: {height: 1, backgroundColor: '#e5e7eb', marginHorizontal: 10},

  expenseButton: {
    padding: widthPercentageToDP('4%'),
    backgroundColor: colors.white,
    width: widthPercentageToDP('45%'),
    borderRadius: widthPercentageToDP('4%'),
    marginBottom: heightPercentageToDP('5%'),
    borderColor: colors.primary,
    borderWidth: widthPercentageToDP('1%'),
  },
});
