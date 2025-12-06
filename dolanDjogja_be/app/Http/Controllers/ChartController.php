<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaketWisata;
use App\Models\Destinasi;
use App\Models\JadwalTrip;

class ChartController extends Controller
{
    public function bookingMonthly()
    {
        $data = Booking::select(
            DB::raw("MONTH(created_at) as month_number"),
            DB::raw("DATE_FORMAT(created_at, '%b') as month"),
            DB::raw("COUNT(*) as total")
        )
        ->groupBy("month_number", "month")
        ->orderBy("month_number")
        ->get();

        return response()->json($data);
    }

    public function revenueMonthly()
    {
        $data = Payment::select(
            DB::raw("MONTH(created_at) as month_number"),
            DB::raw("DATE_FORMAT(created_at, '%b') as month"),
            DB::raw("SUM(jumlah_bayar) as total")
        )
        ->groupBy("month_number", "month")
        ->orderBy("month_number")
        ->get();

        return response()->json($data);
    }

    public function paketPopular()
    {
        $data = Booking::select(
            "paket_wisata.nama_paket as nama",
            DB::raw("COUNT(bookings.id) as total")
        )
        ->join("jadwal_trip", "bookings.jadwal_trip_id", "=", "jadwal_trip.id")
        ->join("paket_wisata", "jadwal_trip.paket_id", "=", "paket_wisata.id")
        ->groupBy("nama")
        ->orderByDesc("total")
        ->get();

        return response()->json($data);
    }

    public function destinasiPopular()
    {
        $data = DB::table("paket_destinasi")
            ->join("destinasi", "paket_destinasi.destinasi_id", "=", "destinasi.id")
            ->select(
                "destinasi.nama_destinasi as nama",
                DB::raw("COUNT(destinasi.id) as total")
            )
            ->groupBy("nama")
            ->orderByDesc("total")
            ->get();

        return response()->json($data);
    }

    public function kuotaTrip()
    {
        $data = JadwalTrip::select(
            DB::raw("CONCAT('Trip ', jadwal_trip.id) as jadwal"),
            DB::raw("
                kuota_tersedia - COALESCE(
                    (SELECT COUNT(*) FROM bookings 
                    WHERE bookings.jadwal_trip_id = jadwal_trip.id),
                0) as sisa_kuota
            ")
        )->from('jadwal_trip')
        ->get();

        return response()->json($data);
    }
}