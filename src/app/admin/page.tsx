"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import Link from "next/link";

type RangeType = "7 Days" | "30 Days" | "Year";

const statsData: Record<RangeType, any[]> = {
  "7 Days": [
    { label: "Total Revenue", value: "₹42,500", trend: "+12.5%", positive: true, icon: IndianRupee },
    { label: "Total Orders", value: "124", trend: "+18.2%", positive: true, icon: ShoppingBag },
    { label: "New Customers", value: "28", trend: "-4.1%", positive: false, icon: Users },
    { label: "Avg. Order Value", value: "₹1,850", trend: "+5.4%", positive: true, icon: TrendingUp },
  ],
  "30 Days": [
    { label: "Total Revenue", value: "₹4,28,500", trend: "+8.2%", positive: true, icon: IndianRupee },
    { label: "Total Orders", value: "1,245", trend: "+12.1%", positive: true, icon: ShoppingBag },
    { label: "New Customers", value: "284", trend: "+5.3%", positive: true, icon: Users },
    { label: "Avg. Order Value", value: "₹1,850", trend: "+2.1%", positive: true, icon: TrendingUp },
  ],
  Year: [
    { label: "Total Revenue", value: "₹48,25,000", trend: "+25.1%", positive: true, icon: IndianRupee },
    { label: "Total Orders", value: "15,240", trend: "+32.4%", positive: true, icon: ShoppingBag },
    { label: "New Customers", value: "3,120", trend: "+18.2%", positive: true, icon: Users },
    { label: "Avg. Order Value", value: "₹1,950", trend: "+12.4%", positive: true, icon: TrendingUp },
  ],
};

const revenueData: Record<RangeType, any[]> = {
  "7 Days": [
    { name: "Mon", revenue: 5000 },
    { name: "Tue", revenue: 8000 },
    { name: "Wed", revenue: 4000 },
    { name: "Thu", revenue: 9500 },
    { name: "Fri", revenue: 7000 },
    { name: "Sat", revenue: 10000 },
    { name: "Sun", revenue: 12000 },
  ],
  "30 Days": [
    { name: "Week 1", revenue: 45000 },
    { name: "Week 2", revenue: 52000 },
    { name: "Week 3", revenue: 48000 },
    { name: "Week 4", revenue: 61000 },
  ],
  Year: [
    { name: "Jan", revenue: 45000 },
    { name: "Feb", revenue: 52000 },
    { name: "Mar", revenue: 48000 },
    { name: "Apr", revenue: 61000 },
    { name: "May", revenue: 55000 },
    { name: "Jun", revenue: 67000 },
    { name: "Jul", revenue: 75000 },
  ],
};

export default function AdminDashboard() {
  const [range, setRange] = useState<RangeType>("30 Days");

  const stats = statsData[range];
  const chartData = revenueData[range];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-sage">
            Dashboard Overview
          </p>
          <h1 className="text-4xl font-serif text-charcoal italic">
            Handmade Growth
          </h1>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-pebble">
          {(Object.keys(statsData) as RangeType[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all ${
                range === r
                  ? "bg-sage text-ivory shadow-md"
                  : "text-charcoal/40 hover:text-sage"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-pebble"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-pebble rounded-xl text-sage">
                <stat.icon size={20} />
              </div>
              <div
                className={`flex items-center text-xs font-bold ${
                  stat.positive ? "text-green-600" : "text-terra"
                }`}
              >
                {stat.trend}
                {stat.positive ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest text-charcoal/40">
              {stat.label}
            </p>
            <p className="text-2xl font-serif font-bold text-charcoal">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-pebble">
        <h3 className="font-serif text-xl text-charcoal mb-6">
          Revenue Analytics
        </h3>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7D8F69" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7D8F69" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7D8F69"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Button */}
      <Link
        href="/admin/orders"
        className="btn-primary py-4 text-xs uppercase tracking-widest inline-block"
      >
        Manage Orders
      </Link>
    </div>
  );
}