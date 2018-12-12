package rocket.team.interactivelanyard.viewmodel

import android.app.Application
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import rocket.team.interactivelanyard.DeviceItem
import rocket.team.interactivelanyard.repository.BluetoothRepository
import java.io.IOException
import java.io.OutputStream
import java.util.*

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private lateinit var bluetoothRepository: BluetoothRepository
    private var btSocket: BluetoothSocket? = null
    private var outStream: OutputStream? = null

    fun getBluetoothDevices(): LiveData<Set<DeviceItem>> {

        if (!::bluetoothRepository.isInitialized) {
            bluetoothRepository = BluetoothRepository(getApplication())
        }
        Log.d("MainViewModel", "Getting bluetooth")
        return bluetoothRepository.getBluetoothDevices()
    }

    fun stopBluetoothScanning() {
        bluetoothRepository.stopDiscovery()
    }

    @Throws(IOException::class)
    private fun createBluetoothSocket(device: BluetoothDevice): BluetoothSocket {
        return device.createRfcommSocketToServiceRecord(MY_UUID)
    }

    fun connectBluetooth(address: String) {
        // TODO: Store address in a lifecycle resilient state
        val device = bluetoothRepository.btAdapter.getRemoteDevice(address)

        try {
            btSocket = createBluetoothSocket(device)
        } catch (e1: IOException) {
            Log.e(TAG, "Socket create failed " + e1.message)
        }

        // Discovery is resource intensive.  Make sure it isn't going on
        // when you attempt to connect and pass your message.
        stopBluetoothScanning()

        // Establish the connection.  This will block until it connects.
        Log.d(TAG, "Connecting")
        try {
            btSocket?.connect()
            Log.d(TAG, "Connection ok")
        } catch (e: IOException) {
            Log.e(TAG, "Could not connect to socket " + e.message)
        }

        // Create a data stream so we can talk to server.
        Log.d(TAG, "Create Socket")

        try {
            outStream = btSocket?.outputStream
        } catch (e: IOException) {
            Log.e(TAG, "Output stream creation failed " + e.message)
        }
    }

    fun sendData(message: String): Boolean {
        val msgBuffer = message.toByteArray()

        Log.d(TAG, "Send data: $message")

        try {
            outStream?.write(msgBuffer)
        } catch (e: IOException) {
            Log.e(TAG, e.message)
            return false
        }
        return true
    }

    companion object {
        private const val TAG = "MainViewModel"

        // SPP UUID service
        private val MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB")
    }
}
