<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalTrip extends Model
{
    use HasFactory;

    protected $table = 'jadwal_trip';

    protected $fillable = [
        'paket_id',
        'tanggal_berangkat',
        'tanggal_pulang',
        'kuota_tersedia',
        'harga_per_orang'
    ];

    public function paket()
    {
        return $this->belongsTo(PaketWisata::class, 'paket_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'jadwal_trip_id');
    }
}