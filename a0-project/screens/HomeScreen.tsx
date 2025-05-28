import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface QuickAction {
  title: string;
  icon: string;
  prompt: string;
  color: string;
}

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Size nasıl yardımcı olabilirim? Adres doğrulama, sıcaklık bilgisi veya genel sorular için buradayım.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const typingMessage: Message = {
      id: 'typing',
      text: 'Düşünüyor...',
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.a0.dev/ai/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Sen Türkçe konuşan yardımcı bir AI asistanısın. Özellikle şu konularda uzmanısın:
              - Adres doğrulama ve konum bilgileri
              - Hava durumu ve sıcaklık bilgileri
              - Genel sorular ve günlük yardım
              
              Kullanıcı bir adres sorarsa, adresin geçerli olup olmadığını kontrol et ve mümkünse koordinat bilgisi ver.
              Sıcaklık sorarsa, genel bilgi ver ve kullanıcıyı uyar ki gerçek zamanlı veri için özel hizmetler gerekir.
              Her zaman nazik, yardımcı ve Türkçe yanıt ver.`
            },
            {
              role: 'user',
              content: userMessage.text
            }
          ]
        }),
      });

      const data = await response.json();

      // Remove typing message
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      if (data.completion) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.completion,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Yanıt alınamadı');
      }
      
      setIsOnline(true);
    } catch (error: any) {
      // Remove typing message
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Bağlantı hatası');
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Adres Doğrula',
      icon: 'location',
      prompt: 'Bu adresi kontrol eder misin: ',
      color: '#FF6B6B',
    },
    {
      title: 'Hava Durumu',
      icon: 'partly-sunny',
      prompt: 'İstanbul\'un hava durumu nasıl?',
      color: '#4ECDC4',
    },
    {
      title: 'Yardım',
      icon: 'help-circle',
      prompt: 'Bana neler konusunda yardım edebilirsin?',
      color: '#45B7D1',
    },
  ];  const handleQuickAction = (action: QuickAction) => {
    if (action.prompt === 'Bu adresi kontrol eder misin: ') {
      setInputText(action.prompt);
    } else {
      setInputText(action.prompt);
      // Auto-send for other actions
      setTimeout(() => {
        if (!isLoading) {
          sendMessage();
        }
      }, 100);
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (message: Message) => (
    <Animated.View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.botMessage,
        { opacity: fadeAnim }
      ]}
    >
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.botBubble
      ]}>
        {message.isTyping ? (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={[styles.messageText, styles.typingText]}>
              {message.text}
            </Text>
          </View>
        ) : (
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userText : styles.botText
          ]}>
            {message.text}
          </Text>
        )}
      </View>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
    </Animated.View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>Hızlı İşlemler</Text>
      <View style={styles.quickActionsRow}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.quickActionButton, { backgroundColor: action.color }]}
            onPress={() => handleQuickAction(action)}
            disabled={isLoading}
          >
            <Ionicons name={action.icon as any} size={20} color="white" />
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Ionicons name="chatbubble-ellipses" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Asistan</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }
                ]} />
                <Text style={styles.statusText}>
                  {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
            {messages.length === 1 && renderQuickActions()}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Mesajınızı yazın..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                editable={!isLoading}
                onSubmitEditing={sendMessage}
              />
              
              <TouchableOpacity
                onPress={sendMessage}
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                ]}
                disabled={!inputText.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 6,
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
    fontWeight: '500',
  },
  botText: {
    color: '#333',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginHorizontal: 8,
  },
  quickActionsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  quickActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 100,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
});