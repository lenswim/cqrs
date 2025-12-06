import { Box, VStack, Textarea, Field, Select, Input, createListCollection, HStack } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react/checkbox";
import { useTheme } from '../../contexts/ThemeContext';
import { lightTheme, darkTheme, transitions, responsiveSpacing } from '../../styles/theme';
import type { LineData } from '../../hooks/useConversationForm';
import type { LineType, Participant } from '../../types/types';

const speechOptions = createListCollection({
  items: [
    { label: "Speech", value: "SPEECH" },
    { label: "Context", value: "CONTEXT" },
  ],
});

interface ConversationDateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ConversationDateField({ value, onChange }: ConversationDateFieldProps) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <Box>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg={theme.background.tertiary}
        borderColor={theme.border.medium}
        color={theme.text.primary}
        px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
        py={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
        borderRadius="8px"
        fontSize="14px"
        transition={transitions.fast}
        _focus={{
          borderColor: theme.accent.primary,
          outline: 'none',
        }}
      />
    </Box>
  );
}

interface ParticipantEditorProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
}

export function ParticipantEditor({ participants, onParticipantsChange }: ParticipantEditorProps) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  const addParticipant = () => {
    onParticipantsChange([...participants, { name: "", victim: false }]);
  };

  const removeParticipant = (index: number) => {
    onParticipantsChange(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: keyof Participant, value: unknown) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    onParticipantsChange(updated);
  };

  return (
    <Box>
      <Box mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} display="flex" alignItems="center" justifyContent="space-between">
        <Box fontSize="13px" fontWeight="600" color={theme.text.primary}>👥 Participants</Box>
        <Box
          as="button"
          onClick={addParticipant}
          px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
          py={{ base: 1, md: responsiveSpacing.mobile }}
          borderRadius="6px"
          fontSize="12px"
          fontWeight="600"
          bg={theme.accent.primary}
          color={theme.text.inverse}
          cursor="pointer"
          transition={transitions.fast}
          _hover={{
            bg: theme.accent.primaryHover,
          }}
        >
          ➕ Add
        </Box>
      </Box>

      {participants.length === 0 ? (
        <Box
          p={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
          bg={theme.background.tertiary}
          borderRadius="8px"
          textAlign="center"
          color={theme.text.secondary}
          fontSize="13px"
        >
          No participants added. Click ➕ to add participants.
        </Box>
      ) : (
        <VStack gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }} align="stretch">
          {participants.map((participant, index) => (
            <HStack key={index} gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
              <Box flex="1">
                <Input
                  placeholder="Participant name"
                  value={participant.name}
                  onChange={(e) => updateParticipant(index, "name", e.target.value)}
                  bg={theme.background.tertiary}
                  borderColor={theme.border.medium}
                  color={theme.text.primary}
                  fontSize="14px"
                  px={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                  py={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
                  borderRadius="6px"
                  _focus={{
                    borderColor: theme.accent.primary,
                    outline: 'none',
                  }}
                />
              </Box>
              <Box>
                <Checkbox.Root
                  checked={participant.victim}
                  onCheckedChange={(e: {checked: boolean | 'indeterminate'}) => updateParticipant(index, "victim", e.checked === true)}
                >
                  <Checkbox.HiddenInput />
                  <Box display="flex" alignItems="center" gap={1}>
                    <Checkbox.Control />
                    <Checkbox.Label fontSize="13px" color={theme.text.primary}>
                      Victim
                    </Checkbox.Label>
                  </Box>
                </Checkbox.Root>
              </Box>
              <Box
                as="button"
                onClick={() => removeParticipant(index)}
                px={{ base: 2, md: responsiveSpacing.mobile }}
                py={{ base: 2, md: responsiveSpacing.mobile }}
                borderRadius="6px"
                fontSize="14px"
                bg={theme.accent.danger}
                color={theme.text.inverse}
                cursor="pointer"
                transition={transitions.fast}
                _hover={{
                  opacity: 0.8,
                }}
              >
                🗑️
              </Box>
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
}

interface LineEditorProps {
  lines: LineData[];
  onLineChange: (index: number, field: keyof LineData, value: unknown) => void;
}

export function LineEditor({ lines, onLineChange }: LineEditorProps) {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <VStack align="stretch" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.desktop }}>
      {lines.map((line, index) => (
        <Box
          key={index}
          bg={theme.background.tertiary}
          borderRadius="10px"
          p={{ base: responsiveSpacing.tablet, md: responsiveSpacing.desktop }}
          border="2px solid"
          borderColor={line.punchLine ? theme.stats.punchlines : theme.border.light}
          transition={transitions.normal}
        >
          <Box
            fontSize="13px"
            fontWeight="700"
            color={theme.text.primary}
            mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
            display="flex"
            alignItems="center"
            gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
          >
            <Box>Line {index + 1}</Box>
          </Box>

          {/* Line Type Select */}
          <Field.Root id={`line-type-${index}`} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
            <Field.Label fontSize="13px" fontWeight="600" color={theme.text.primary} mb={2}>
              Line Type
            </Field.Label>
            <Select.Root
              collection={speechOptions}
              value={[line.lineType]}
              onValueChange={(details) => {
                const arr = details.value;
                const next = (arr?.[0] ?? "SPEECH") as LineType;
                onLineChange(index, "lineType", next);
              }}
            >
              <Select.HiddenSelect name={`lines[${index}].lineType`} />
              <Select.Control>
                <Select.Trigger
                  bg={theme.background.secondary}
                  borderColor={theme.border.medium}
                  color={theme.text.primary}
                  borderRadius="6px"
                  _focus={{
                    borderColor: theme.accent.primary,
                  }}
                >
                  <Select.ValueText placeholder="Choose type" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content
                  bg={theme.background.card}
                  borderColor={theme.border.medium}
                >
                  {speechOptions.items.map((item) => (
                    <Select.Item
                      key={item.value}
                      item={item}
                      color={theme.text.primary}
                      _hover={{
                        bg: theme.background.cardHover,
                      }}
                    >
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Field.Root>

          {/* Participants */}
          <Box mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
            <ParticipantEditor
              participants={line.participants}
              onParticipantsChange={(participants) => onLineChange(index, "participants", participants)}
            />
          </Box>

          {/* Text Field */}
          <Field.Root id={`line-text-${index}`} mb={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
            <Field.Label fontSize="13px" fontWeight="600" color={theme.text.primary} mb={2}>
              Text
            </Field.Label>
            <Textarea
              value={line.text}
              onChange={(e) => onLineChange(index, "text", e.target.value)}
              rows={3}
              bg={theme.background.secondary}
              borderColor={line.punchLine ? theme.stats.punchlines : theme.border.medium}
              color={theme.text.primary}
              borderRadius="6px"
              fontSize="14px"
              _focus={{
                borderColor: line.punchLine ? theme.stats.punchlines : theme.accent.primary,
                outline: 'none',
              }}
            />
          </Field.Root>

          {/* Punch Line Checkbox */}
          <Field.Root id={`line-punch-${index}`}>
            <Box
              p={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}
              borderRadius="8px"
              bg={line.punchLine ? theme.stats.punchlines + '20' : theme.background.secondary}
              borderWidth={2}
              borderColor={line.punchLine ? theme.stats.punchlines : theme.border.light}
              transition={transitions.fast}
            >
              <Checkbox.Root
                checked={line.punchLine}
                onCheckedChange={(e: {checked: boolean | 'indeterminate'}) => {
                  onLineChange(index, "punchLine", e.checked === true);
                }}
              >
                <Checkbox.HiddenInput />
                <Box display="flex" alignItems="center" gap={{ base: responsiveSpacing.mobile, md: responsiveSpacing.tablet }}>
                  <Checkbox.Control
                    borderColor={line.punchLine ? theme.stats.punchlines : theme.border.dark}
                  />
                  <Checkbox.Label
                    fontWeight="600"
                    cursor="pointer"
                    fontSize="14px"
                    color={line.punchLine ? theme.stats.punchlines : theme.text.primary}
                  >
                    This is a Punchline
                  </Checkbox.Label>
                </Box>
              </Checkbox.Root>
            </Box>
          </Field.Root>
        </Box>
      ))}
    </VStack>
  );
}

